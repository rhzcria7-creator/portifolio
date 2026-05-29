import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { z } from 'zod';
import { google } from 'googleapis';
import sanitizeHtml from 'sanitize-html';

import { logger, auditLog } from './server/logger';
import { contactRateLimiter, honeypotMiddleware, spamScoringMiddleware } from './server/antiSpam';
import { emailQueue } from './server/queue';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Audit & Access Logging
  app.use(morgan('combined'));

  // 2. Strict Security Headers (OWASP)
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://apis.google.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "blob:", "https://images.unsplash.com", "https://apis.google.com"],
        connectSrc: ["'self'", "https://www.googleapis.com", "https://identitytoolkit.googleapis.com", "https://securetoken.googleapis.com"],
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }, 
    frameguard: { action: 'deny' },
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
  }));

  // 3. CORS Configuration
  app.use(cors({ 
    origin: true, // In production, replace with specific domains
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // 4. Rate Limiting (DDoS & Abuse Prevention)
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 150,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Rate limit exceeded. Please try again later.' }
  });
  app.use('/api/', apiLimiter);
  
  // Middleware - Strict Payload parsing
  app.use(express.json({ limit: '10kb' })); // Mitigate Large Payload DOS
  
  // Auth Middleware
  const requireAuth = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized', code: 'AUTH_MISSING' });
    }
    req.accessToken = authHeader.split(' ')[1];
    next();
  };

  // Google API Client Wrapper
  const getGoogleAuth = (token: string) => {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token });
    return oauth2Client;
  };

  // 5. SECURED API ROUTES (Google Workspace)
  
  app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  // GMAIL - Read Messages (Readonly)
  app.get('/api/workspace/gmail/messages', requireAuth, async (req: any, res: any) => {
    try {
      const gmail = google.gmail({ version: 'v1', auth: getGoogleAuth(req.accessToken) });
      const response = await gmail.users.messages.list({ userId: 'me', maxResults: 10 });
      res.json({ messages: response.data.messages || [] });
    } catch (error: any) {
      console.error('[GMAIL ERROR]', error.message);
      res.status(502).json({ error: 'Upstream service error' });
    }
  });

  // CALENDAR - List Events
  app.get('/api/workspace/calendar/events', requireAuth, async (req: any, res: any) => {
    try {
      const calendar = google.calendar({ version: 'v3', auth: getGoogleAuth(req.accessToken) });
      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults: 15,
        singleEvents: true,
        orderBy: 'startTime',
      });
      res.json({ events: response.data.items || [] });
    } catch (error: any) {
      console.error('[CALENDAR ERROR]', error.message);
      res.status(502).json({ error: 'Upstream service error' });
    }
  });

  // CALENDAR - Create Event with Meeting
  const scheduleSchema = z.object({
    summary: z.string().min(1).max(200),
    description: z.string().max(1000).optional(),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    attendees: z.array(z.string().email()).optional()
  });

  app.post('/api/workspace/calendar/schedule', requireAuth, async (req: any, res: any) => {
    try {
      const data = scheduleSchema.parse(req.body);
      const calendar = google.calendar({ version: 'v3', auth: getGoogleAuth(req.accessToken) });
      
      const event = {
        summary: data.summary,
        description: data.description || 'Reunião agendada via sistema.',
        start: { dateTime: data.startTime },
        end: { dateTime: data.endTime },
        attendees: data.attendees?.map(email => ({ email })) || [],
        conferenceData: {
          createRequest: {
            requestId: crypto.randomUUID(),
            conferenceSolutionKey: { type: 'hangoutsMeet' }
          }
        }
      };

      const response = await calendar.events.insert({
        calendarId: 'primary',
        conferenceDataVersion: 1,
        sendUpdates: 'all',
        requestBody: event
      });

      res.json({ success: true, event: response.data, meetLink: response.data.hangoutLink });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
         return res.status(400).json({ error: 'Invalid Input', details: error.flatten().fieldErrors });
      }
      console.error('[CALENDAR SCHEDULE ERROR]', error.message);
      res.status(502).json({ error: 'Upstream service error' });
    }
  });

  // FORMS - Read Form Responses
  const formSchema = z.object({
    formId: z.string().min(10).max(100).regex(/^[a-zA-Z0-9_-]+$/)
  });

  app.get('/api/workspace/forms/:formId/responses', requireAuth, async (req: any, res: any) => {
    try {
      const { formId } = formSchema.parse(req.params);
      const forms = google.forms({ version: 'v1', auth: getGoogleAuth(req.accessToken) });
      const response = await forms.forms.responses.list({ formId });
      res.json({ responses: response.data.responses || [] });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
         return res.status(400).json({ error: 'Invalid Input', details: error.flatten().fieldErrors });
      }
      console.error('[FORMS ERROR]', error.message);
      res.status(502).json({ error: 'Upstream service error' });
    }
  });

  // CHAT - List Spaces
  app.get('/api/workspace/chat/spaces', requireAuth, async (req: any, res: any) => {
    try {
      const chat = google.chat({ version: 'v1', auth: getGoogleAuth(req.accessToken) });
      const response = await chat.spaces.list();
      res.json({ spaces: response.data.spaces || [] });
    } catch (error: any) {
      console.error('[CHAT ERROR]', error.message);
      res.status(502).json({ error: 'Upstream service error' });
    }
  });

  // ENTERPRISE CONTACT FORM LOGIC

  const contactSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    message: z.string().min(10).max(1000),
    _honeypot: z.string().optional() // Invisible trap
  });

  app.post(
    '/api/contact',
    contactRateLimiter,
    honeypotMiddleware,
    spamScoringMiddleware,
    async (req: any, res: any) => {
      try {
        // 1. Strict Payload Validation
        const validated = contactSchema.parse(req.body);
        
        // 2. Output HTML Sanitization (Prevent XSS on internal dashboard readers)
        const cleanMessage = sanitizeHtml(validated.message, { allowedTags: [], allowedAttributes: {} });

        // 3. Queue Job (Sidekiq abstraction)
        await emailQueue.add('contact-submission', {
          to: 'rhz.cria.7@gmail.com',
          subject: `New Lead from ${validated.name}`,
          body: `Email: ${validated.email}\n\nMessage:\n${cleanMessage}`,
          replyTo: validated.email
        });

        // 4. Audit Trail
        auditLog('CONTACT_SUBMISSION', 'anonymous', 'ContactForm', { ip: req.ip, email: validated.email });

        res.json({ success: true, message: 'Your message has been securely submitted.' });
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ error: 'Validation failed', details: error.flatten().fieldErrors });
        }
        console.error('[CONTACT ERROR]', error);
        res.status(500).json({ error: 'Server error processing request.' });
      }
  });

  // Error handling middleware
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('[UNHANDLED ERROR]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Enterprise Secure Server running on port ${PORT}`);
  });
}

startServer().catch(console.error);

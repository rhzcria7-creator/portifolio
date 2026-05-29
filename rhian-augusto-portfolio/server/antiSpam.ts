import rateLimit from 'express-rate-limit';
import { logger } from './logger';
import { Request, Response, NextFunction } from 'express';

// 1. IP Throttling and Abuse Prevention
export const contactRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Strict limit: 5 contact requests per IP per hour
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn(`[ANTI-SPAM] Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({ error: 'Too many requests, please try again later.' });
    }
});

// 2. Honeypot Validation Middleware
// Bots often fill hidden fields out of habit. 
export const honeypotMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { _honeypot } = req.body;
    
    if (_honeypot && _honeypot.trim() !== '') {
        // Honeypot field was filled. This is a bot.
        logger.warn(`[ANTI-SPAM] Honeypot triggered by IP: ${req.ip}`);
        // Return 200 to trick the bot into thinking it succeeded.
        return res.status(200).json({ success: true, message: 'Message sent successfully.' });
    }
    
    next();
};

// 3. Spam Scoring Analysis (Basic Request Fingerprinting)
export const spamScoringMiddleware = (req: Request, res: Response, next: NextFunction) => {
    let score = 0;
    const { message, email } = req.body;
    const userAgent = req.headers['user-agent'] || '';

    // Penalty for lacking User-Agent
    if (!userAgent) score += 5;

    // Penalty for typical spam keywords (simulated)
    const spamKeywords = ['crypto', 'viagra', 'seo services', 'buy followers', 'invest'];
    if (message) {
        const lowerMessage = message.toLowerCase();
        spamKeywords.forEach(word => {
            if (lowerMessage.includes(word)) score += 3;
        });
        
        // Link spam
        const linkCount = (message.match(/https?:\/\//g) || []).length;
        if (linkCount > 2) score += 2;
    }

    if (score >= 5) {
        logger.warn(`[ANTI-SPAM] High spam score (${score}) detected for IP: ${req.ip}. Rejecting.`);
        return res.status(400).json({ error: 'Message flagged as spam.' });
    }

    next();
};

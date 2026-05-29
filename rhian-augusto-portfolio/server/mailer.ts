import nodemailer from 'nodemailer';
import { logger } from './logger';

export interface EmailPayload {
    to: string;
    subject: string;
    body: string;
    replyTo?: string;
}

// Enterprise Mailer with SMTP Abstraction & Provider Selection
// Supports Resend, SES, Postmark via SMTP bridge
const createTransporter = () => {
    // In production, these come from encrypted Env Vaults
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER || 'ethereal.user', 
            pass: process.env.SMTP_PASS || 'ethereal.pass'
        }
    });
};

export const sendEmailInternal = async (payload: EmailPayload) => {
    const transporter = createTransporter();
    
    logger.info(`[MAILER] Preparing to send email to ${payload.to}`);
    
    // DKIM, SPF, DMARC are managed at DNS + Provider level 
    // We enforce standardized headers here
    const mailOptions = {
        from: '"Enterprise System" <system@yourdomain.com>',
        to: payload.to,
        subject: payload.subject,
        text: payload.body, // Fallback
        html: `<div>${payload.body}</div>`,
        replyTo: payload.replyTo,
        headers: {
            'X-Priority': '1 (Highest)',
            'X-Mailer': 'EnterpriseMailer',
        }
    };

    // If using simulated Ethereal (default when no secrets), it just logs.
    if (!process.env.SMTP_HOST) {
        logger.warn('[MAILER] No SMTP config found. Simulating delivery for audit mode.');
        return Promise.resolve({ simulate: true });
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        logger.info(`[MAILER] Message delivered: ${info.messageId}`);
        return info;
    } catch (error) {
        logger.error(`[MAILER] Delivery failed: ${error}`);
        throw error;
    }
};

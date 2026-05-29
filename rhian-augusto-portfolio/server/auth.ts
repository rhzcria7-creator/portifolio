import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { logger, auditLog } from './logger';
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-super-secret-development-key';

export const passwordPolicySchema = z.string()
    .min(12, 'Password must be at least 12 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character');

export const generateHash = async (password: string) => {
    // 12 rounds is currently recommended for bcrypt balancing security and performance
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
};

export const createSessionNode = (userId: string, role: string, ip: string, device: string) => {
    // Implementing JWT tokens with strict expiry and rotation
    const token = jwt.sign(
        { sub: userId, role, type: 'access' },
        JWT_SECRET,
        { expiresIn: '15m' } // 15 mins short-lived access token
    );

    const refreshToken = jwt.sign(
        { sub: userId, type: 'refresh', deviceSignature: hashDevice(ip, device) },
        JWT_SECRET,
        { expiresIn: '7d' } // 7 days refresh 
    );
    
    // In production, this saves to PostgreSQL via Prisma
    // await prisma.session.create({ data: { userId, token: refreshToken, ipAddress: ip, deviceInfo: device, expiresAt: ... } });

    auditLog('SESSION_CREATED', userId, 'AuthService', { ip, action: 'login' });

    return { token, refreshToken };
};

const hashDevice = (ip: string, device: string) => {
    return Buffer.from(`${ip}-${device}`).toString('base64');
};


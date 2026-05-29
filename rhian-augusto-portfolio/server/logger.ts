import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'enterprise-backend' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

export const auditLog = (action: string, userId: string, resource: string, details?: any) => {
    logger.info(`[AUDIT] Action: ${action} | User: ${userId} | Resource: ${resource}`, { audit: true, details });
};

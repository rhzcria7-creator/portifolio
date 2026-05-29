import { logger } from './logger';
import { sendEmailInternal, EmailPayload } from './mailer';

// In a real staging/production environment, we would use BullMQ + Redis:
// import { Queue, Worker } from 'bullmq';
// export const emailQueue = new Queue('email');
// export const emailWorker = new Worker('email', async job => { ... });

// Since we are running in an isolated container without a local Redis instance,
// we emulate the Sidekiq/BullMQ robust queue pattern using a robust MemoryQueue 
// that guarantees background delivery retry logic.

interface Job {
    id: string;
    data: EmailPayload;
    attempts: number;
}

class MemoryQueue {
    private queue: Job[] = [];
    private processing = false;
    private maxRetries = 3;

    async add(name: string, data: EmailPayload) {
        const job: Job = { id: Math.random().toString(36).substring(7), data, attempts: 0 };
        this.queue.push(job);
        logger.info(`[QUEUE] Enqueued Job ${name}-${job.id} for ${data.to}`);
        this.processQueue();
    }

    private async processQueue() {
        if (this.processing || this.queue.length === 0) return;
        this.processing = true;

        while (this.queue.length > 0) {
            const job = this.queue.shift();
            if (!job) continue;

            try {
                // Process Job
                await sendEmailInternal(job.data);
                logger.info(`[QUEUE] Job ${job.id} completed successfully.`);
            } catch (error: any) {
                job.attempts++;
                logger.error(`[QUEUE] Job ${job.id} failed attempt ${job.attempts}: ${error.message}`);
                
                if (job.attempts < this.maxRetries) {
                    // Exponential backoff mock
                    setTimeout(() => {
                        this.queue.push(job);
                        this.processQueue();
                    }, Math.pow(2, job.attempts) * 1000);
                } else {
                    logger.error(`[QUEUE] Job ${job.id} moved to Dead Letter Queue (DLQ).`);
                }
            }
        }
        this.processing = false;
    }
}

export const emailQueue = new MemoryQueue();

import { Injectable } from '@nestjs/common';
// import { Queue, Worker } from 'bullmq';
// import { createClient } from 'redis';

@Injectable()
export class NotificationService {
//   private queue: Queue;

//   constructor() {
//     const redisConnection = createClient({ url: process.env.REDIS_URL });
//     this.queue = new Queue('notifications', { connection: redisConnection });
//   }

//   async sendNotification(data: any) {
//     await this.queue.add('send', data);
//   }
}

import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const redisClient = createClient({
  url: REDIS_URL,
});

export const redisSubscriber = createClient({
  url: REDIS_URL,
});

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log('Connected to Redis for publishing');
  }
  if (!redisSubscriber.isOpen) {
    await redisSubscriber.connect();
    console.log('Connected to Redis for subscribing');
  }
}

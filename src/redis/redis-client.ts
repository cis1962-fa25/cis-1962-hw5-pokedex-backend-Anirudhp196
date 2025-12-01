import { createClient, type RedisClientType } from 'redis';

const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';

export const redisClient: RedisClientType = createClient({
  url: redisUrl,
});

redisClient.on('error', (error) => {
  console.error('Redis error', error);
});

export const connectRedis = async (): Promise<void> => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};


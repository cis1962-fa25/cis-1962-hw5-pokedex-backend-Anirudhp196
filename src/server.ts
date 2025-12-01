import 'dotenv/config';
import { app } from './app.js';
import { connectRedis } from './redis/redis-client.js';

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const PORT = Number(process.env.PORT ?? '3000');
const JWT_SECRET = requireEnv('JWT_TOKEN_SECRET');

process.env.JWT_TOKEN_SECRET = JWT_SECRET;
process.env.REDIS_URL ??= 'redis://localhost:6379';

const startServer = async (): Promise<void> => {
  await connectRedis();

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});


import { app } from './app';
import { env } from './config/env';
import { prisma } from './config/prisma';
import { logger } from './lib/logger';

const start = async (): Promise<void> => {
  await prisma.$connect();

  app.listen(env.PORT, () => {
    logger.info(`VaulTex API is running on port ${env.PORT}`);
  });
};

void start().catch((error: unknown) => {
  logger.error('Failed to start server', error);
  process.exit(1);
});

const shutdown = async (): Promise<void> => {
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', () => {
  void shutdown();
});

process.on('SIGTERM', () => {
  void shutdown();
});

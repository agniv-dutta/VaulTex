process.env.NODE_ENV = process.env.NODE_ENV ?? 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL ?? 'file:./prisma/test.db';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret-key-test-secret-key-123456';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '1h';
process.env.PORT = process.env.PORT ?? '3001';
process.env.RATE_LIMIT_WINDOW_MS = process.env.RATE_LIMIT_WINDOW_MS ?? '900000';
process.env.RATE_LIMIT_MAX = process.env.RATE_LIMIT_MAX ?? '100';

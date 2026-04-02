import { execSync } from 'node:child_process';
import { existsSync, unlinkSync } from 'node:fs';

process.env.NODE_ENV = process.env.NODE_ENV ?? 'test';
process.env.DATABASE_URL = 'file:./test.db';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret-key-test-secret-key-123456';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '1h';
process.env.PORT = process.env.PORT ?? '3001';
process.env.RATE_LIMIT_WINDOW_MS = process.env.RATE_LIMIT_WINDOW_MS ?? '900000';
process.env.RATE_LIMIT_MAX = process.env.RATE_LIMIT_MAX ?? '100';

for (const filePath of ['prisma/test.db', 'prisma/test.db-shm', 'prisma/test.db-wal', 'prisma/prisma/dev.db', 'prisma/prisma/test.db']) {
	if (existsSync(filePath)) {
		unlinkSync(filePath);
	}
}

execSync('npx prisma migrate deploy', {
	stdio: 'inherit',
	env: process.env
});

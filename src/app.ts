import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { authRouter } from './modules/auth/auth.routes';
import { usersRouter } from './modules/users/users.routes';
import { recordsRouter } from './modules/records/records.routes';
import { dashboardRouter } from './modules/dashboard/dashboard.routes';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { env } from './config/env';

export const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(
  rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    limit: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get('/health', (_req, res: express.Response) => {
  res.json({ status: 'ok', service: 'VaulTex' });
});

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/records', recordsRouter);
app.use('/api/dashboard', dashboardRouter);

app.use(notFound);
app.use(errorHandler);

import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from './errors';
import type { AuthTokenPayload } from '../types/auth';

export const signAccessToken = (payload: AuthTokenPayload): string =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

export const verifyAccessToken = (token: string): AuthTokenPayload => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
  } catch {
    throw new AppError('Invalid or expired token', 401);
  }
};

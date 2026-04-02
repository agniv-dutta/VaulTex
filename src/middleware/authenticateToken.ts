import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../lib/errors';
import { verifyAccessToken } from '../lib/jwt';

export const authenticateToken = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith('Bearer ')) {
    next(new AppError('Missing or invalid token', 401));
    return;
  }

  const token = authorizationHeader.slice(7);
  const payload = verifyAccessToken(token);

  req.user = {
    id: payload.userId,
    userId: payload.userId,
    email: payload.email,
    role: payload.role
  };

  next();
};

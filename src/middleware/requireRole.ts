import type { NextFunction, Request, Response } from 'express';
import type { Role } from '@prisma/client';
import { AppError } from '../lib/errors';

export const requireRole = (...allowedRoles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Unauthorized', 401));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new AppError('Forbidden', 403));
      return;
    }

    next();
  };

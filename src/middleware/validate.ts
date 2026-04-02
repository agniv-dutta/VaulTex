import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ZodTypeAny } from 'zod';
import { ZodError } from 'zod';
import { AppError } from '../lib/errors';

type ValidationSchemas = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
};

export const validate = ({ body, query, params }: ValidationSchemas): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      const validated: Record<string, unknown> = {};

      if (body) {
        validated.body = body.parse(req.body);
      }

      if (query) {
        validated.query = query.parse(req.query);
      }

      if (params) {
        validated.params = params.parse(req.params);
      }

      (_res.locals as { validated?: Record<string, unknown> }).validated = validated;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;
        next(
          new AppError('Validation failed', 400, zodError.issues.map((issue: ZodError['issues'][number]) => ({
            path: issue.path.join('.'),
            message: issue.message
          })))
        );
        return;
      }

      next(error);
    }
  };

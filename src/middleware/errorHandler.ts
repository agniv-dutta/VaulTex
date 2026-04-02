import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { isAppError } from '../lib/errors';

const isPrismaKnownRequestError = (value: unknown): value is { code: string } =>
  typeof value === 'object' && value !== null && 'code' in value && typeof (value as { code?: unknown }).code === 'string';

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (isAppError(error)) {
    res.status(error.statusCode).json({
      error: error.message,
      message: error.message,
      statusCode: error.statusCode,
      ...(error.details ? { details: error.details } : {})
    });
    return;
  }

  if (error instanceof ZodError) {
    const zodError = error as ZodError;
    res.status(400).json({
      error: 'Validation failed',
      message: 'Validation failed',
      statusCode: 400,
      details: zodError.issues.map((issue: ZodError['issues'][number]) => ({
        path: issue.path.join('.'),
        message: issue.message
      }))
    });
    return;
  }

  if (isPrismaKnownRequestError(error)) {
    if (error.code === 'P2002') {
      res.status(409).json({
        error: 'Conflict',
        message: 'A resource with the same unique value already exists',
        statusCode: 409
      });
      return;
    }

    if (error.code === 'P2025') {
      res.status(404).json({
        error: 'Not Found',
        message: 'Resource not found',
        statusCode: 404
      });
      return;
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(error);
  }

  const statusCode = 500;
  res.status(statusCode).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
    statusCode
  });
};

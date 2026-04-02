import type { Request, Response } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import { authService } from './auth.service';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register((res.locals as { validated?: { body?: { name: string; email: string; password: string } } }).validated?.body ?? req.body);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login((res.locals as { validated?: { body?: { email: string; password: string } } }).validated?.body ?? req.body);
  res.json(result);
});

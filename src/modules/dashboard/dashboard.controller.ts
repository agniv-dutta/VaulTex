import type { Request, Response } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import { dashboardService } from './dashboard.service';

export const summary = asyncHandler(async (req: Request, res: Response) => {
  const data = await dashboardService.summary(req.user!);
  res.json({ data });
});

export const byCategory = asyncHandler(async (req: Request, res: Response) => {
  const data = await dashboardService.byCategory(req.user!);
  res.json({ data });
});

export const monthly = asyncHandler(async (req: Request, res: Response) => {
  const data = await dashboardService.monthly(req.user!);
  res.json({ data });
});

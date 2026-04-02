import type { Request, Response } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import { usersService } from './users.service';

export const listUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await usersService.listUsers();
  res.json({ data: users });
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await usersService.getUserById(req.params.id as string);
  res.json({ data: user });
});

export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const user = await usersService.updateRole(req.params.id as string, req.body.role);
  res.json({ data: user });
});

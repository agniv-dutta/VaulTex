import { z } from 'zod';
import { isoDateStringSchema } from '../../schemas/common';

export const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const authResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']),
    createdAt: isoDateStringSchema,
    updatedAt: isoDateStringSchema
  })
});

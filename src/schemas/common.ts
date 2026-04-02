import { z } from 'zod';

export const roleSchema = z.enum(['VIEWER', 'ANALYST', 'ADMIN']);
export const recordTypeSchema = z.enum(['INCOME', 'EXPENSE']);

export const isoDateStringSchema = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: 'Must be a valid ISO date string'
  });

export const uuidSchema = z.string().uuid();

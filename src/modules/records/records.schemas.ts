import { z } from 'zod';
import { isoDateStringSchema, recordTypeSchema, uuidSchema } from '../../schemas/common';

export const createRecordSchema = z.object({
  userId: uuidSchema,
  amount: z.coerce.number().positive(),
  type: recordTypeSchema,
  category: z.string().min(1).max(100),
  date: isoDateStringSchema,
  notes: z.string().max(1000).optional().nullable()
});

export const updateRecordSchema = createRecordSchema.partial().extend({
  isDeleted: z.boolean().optional()
});

export const recordIdParamsSchema = z.object({ id: uuidSchema });

export const listRecordsQuerySchema = z.object({
  type: recordTypeSchema.optional(),
  category: z.string().min(1).max(100).optional(),
  startDate: isoDateStringSchema.optional(),
  endDate: isoDateStringSchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
});

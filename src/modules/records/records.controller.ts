import type { Request, Response } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import { recordsService } from './records.service';

export const createRecord = asyncHandler(async (req: Request, res: Response) => {
  const validated = res.locals as { validated?: { body?: Parameters<typeof recordsService.createRecord>[0] } };
  const record = await recordsService.createRecord(validated.validated?.body ?? req.body);
  res.status(201).json({ data: record });
});

export const listRecords = asyncHandler(async (req: Request, res: Response) => {
  const validated = res.locals as {
    validated?: {
      query?: {
        type?: 'INCOME' | 'EXPENSE';
        category?: string;
        startDate?: string;
        endDate?: string;
        page: number;
        limit: number;
      };
    };
  };

  const result = await recordsService.listRecords(req.user!, validated.validated?.query ?? (req.query as never));
  res.json(result);
});

export const getRecordById = asyncHandler(async (req: Request, res: Response) => {
  const validated = res.locals as { validated?: { params?: { id: string } } };
  const record = await recordsService.getRecordById(req.user!, validated.validated?.params?.id ?? (req.params.id as string));
  res.json({ data: record });
});

export const updateRecord = asyncHandler(async (req: Request, res: Response) => {
  const validated = res.locals as {
    validated?: {
      params?: { id: string };
      body?: Parameters<typeof recordsService.updateRecord>[1];
    };
  };

  const record = await recordsService.updateRecord(
    validated.validated?.params?.id ?? (req.params.id as string),
    validated.validated?.body ?? req.body
  );
  res.json({ data: record });
});

export const deleteRecord = asyncHandler(async (req: Request, res: Response) => {
  const validated = res.locals as { validated?: { params?: { id: string } } };
  const record = await recordsService.deleteRecord(validated.validated?.params?.id ?? (req.params.id as string));
  res.json({ data: record });
});

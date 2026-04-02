import type { Request, Response } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import { recordsService } from './records.service';

export const createRecord = asyncHandler(async (req: Request, res: Response) => {
  const record = await recordsService.createRecord(req.body);
  res.status(201).json({ data: record });
});

export const listRecords = asyncHandler(async (req: Request, res: Response) => {
  const result = await recordsService.listRecords(req.user!, req.query as never);
  res.json(result);
});

export const getRecordById = asyncHandler(async (req: Request, res: Response) => {
  const record = await recordsService.getRecordById(req.user!, req.params.id);
  res.json({ data: record });
});

export const updateRecord = asyncHandler(async (req: Request, res: Response) => {
  const record = await recordsService.updateRecord(req.params.id, req.body);
  res.json({ data: record });
});

export const deleteRecord = asyncHandler(async (req: Request, res: Response) => {
  const record = await recordsService.deleteRecord(req.params.id);
  res.json({ data: record });
});

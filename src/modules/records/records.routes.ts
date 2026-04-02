import { Router } from 'express';
import { authenticateToken } from '../../middleware/authenticateToken';
import { requireRole } from '../../middleware/requireRole';
import { validate } from '../../middleware/validate';
import { uuidSchema } from '../../schemas/common';
import { createRecordSchema, listRecordsQuerySchema, recordIdParamsSchema, updateRecordSchema } from './records.schemas';
import { createRecord, deleteRecord, getRecordById, listRecords, updateRecord } from './records.controller';
import { z } from 'zod';

const router = Router();
const createRecordBodySchema = createRecordSchema;
const updateRecordBodySchema = updateRecordSchema;
const paramsSchema = recordIdParamsSchema;
const listQuerySchema = listRecordsQuerySchema;

router.use(authenticateToken);

router.post('/', requireRole('ADMIN'), validate({ body: createRecordBodySchema }), createRecord);
router.get('/', validate({ query: listQuerySchema }), listRecords);
router.get('/:id', validate({ params: paramsSchema }), getRecordById);
router.patch('/:id', requireRole('ADMIN'), validate({ params: paramsSchema, body: updateRecordBodySchema }), updateRecord);
router.delete('/:id', requireRole('ADMIN'), validate({ params: paramsSchema }), deleteRecord);

export { router as recordsRouter };

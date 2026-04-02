import { Router } from 'express';
import { authenticateToken } from '../../middleware/authenticateToken';
import { requireRole } from '../../middleware/requireRole';
import { validate } from '../../middleware/validate';
import { roleSchema, uuidSchema } from '../../schemas/common';
import { getUserById, listUsers, updateUserRole } from './users.controller';
import { z } from 'zod';

const router = Router();
const roleUpdateSchema = z.object({ role: roleSchema });
const userIdParamsSchema = z.object({ id: uuidSchema });

router.use(authenticateToken, requireRole('ADMIN'));

router.get('/', listUsers);
router.get('/:id', validate({ params: userIdParamsSchema }), getUserById);
router.patch('/:id/role', validate({ params: userIdParamsSchema, body: roleUpdateSchema }), updateUserRole);

export { router as usersRouter };

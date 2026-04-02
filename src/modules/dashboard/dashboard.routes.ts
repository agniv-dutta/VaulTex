import { Router } from 'express';
import { authenticateToken } from '../../middleware/authenticateToken';
import { summary, byCategory, monthly } from './dashboard.controller';

const router = Router();

router.use(authenticateToken);
router.get('/summary', summary);
router.get('/by-category', byCategory);
router.get('/monthly', monthly);

export { router as dashboardRouter };

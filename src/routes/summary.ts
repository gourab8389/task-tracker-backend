import { Router } from 'express';
import { summaryController } from '../controllers/summaryController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/daily', summaryController.getDailySummary);
router.get('/weekly', summaryController.getWeeklySummary);

export default router;
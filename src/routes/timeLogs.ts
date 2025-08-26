import { Router } from 'express';
import { timeLogController } from '../controllers/timeLogController';
import { validateRequest } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { startTimerSchema } from '../utils/validation';

const router = Router();

router.use(authenticateToken);

router.post('/start', validateRequest(startTimerSchema), timeLogController.startTimer);
router.put('/stop/:id', timeLogController.stopTimer);
router.get('/active', timeLogController.getActiveTimer);
router.get('/', timeLogController.getTimeLogs);
router.delete('/:id', timeLogController.deleteTimeLog);

export default router;
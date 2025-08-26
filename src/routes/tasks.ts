import { Router } from 'express';
import { taskController } from '../controllers/taskController';
import { validateRequest } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { createTaskSchema, updateTaskSchema } from '../utils/validation';

const router = Router();

router.use(authenticateToken);

router.post('/', validateRequest(createTaskSchema), taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTaskById);
router.put('/:id', validateRequest(updateTaskSchema), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;
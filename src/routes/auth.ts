import { Router } from 'express';
import { authController } from '../controllers/authController';
import { validateRequest } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { registerSchema, loginSchema } from '../utils/validation';

const router = Router();

router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.get('/profile', authenticateToken, authController.getProfile);
router.post('/logout', authenticateToken, authController.logout);

export default router;
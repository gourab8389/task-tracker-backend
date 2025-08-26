import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { sendSuccess, sendError } from '../utils/response';
import { RegisterRequest, LoginRequest } from '../types/auth';
import { AuthenticatedRequest } from '../middleware/auth';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: RegisterRequest = req.body;
      const result = await authService.register(data);
      sendSuccess(res, 'User registered successfully', result, 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: LoginRequest = req.body;
      const result = await authService.login(data);
      sendSuccess(res, 'Login successful', result);
    } catch (error: any) {
      sendError(res, error.message, 401);
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const user = await authService.getProfile(userId);
      sendSuccess(res, 'Profile retrieved successfully', user);
    } catch (error: any) {
      sendError(res, error.message, 404);
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    sendSuccess(res, 'Logged out successfully');
  }
}

export const authController = new AuthController()
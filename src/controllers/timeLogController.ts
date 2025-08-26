import { Response, NextFunction } from 'express';
import { timeLogService } from '../services/timeLogService';
import { sendSuccess, sendError } from '../utils/response';
import { StartTimerRequest } from '../types/timeLog';
import { AuthenticatedRequest } from '../middleware/auth';

export class TimeLogController {
  async startTimer(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { taskId }: StartTimerRequest = req.body;
      const timeLog = await timeLogService.startTimer(userId, taskId);
      sendSuccess(res, 'Timer started successfully', timeLog, 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async stopTimer(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const timeLogId = req.params.id;
      const timeLog = await timeLogService.stopTimer(userId, timeLogId);
      sendSuccess(res, 'Timer stopped successfully', timeLog);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getActiveTimer(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const activeTimer = await timeLogService.getActiveTimer(userId);
      sendSuccess(res, 'Active timer retrieved successfully', activeTimer);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getTimeLogs(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const result = await timeLogService.getTimeLogs(userId, page, limit);
      sendSuccess(res, 'Time logs retrieved successfully', result);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async deleteTimeLog(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const timeLogId = req.params.id;
      const result = await timeLogService.deleteTimeLog(userId, timeLogId);
      sendSuccess(res, result.message);
    } catch (error: any) {
      sendError(res, error.message, 404);
    }
  }
}

export const timeLogController = new TimeLogController();
import { Response, NextFunction } from 'express';
import { summaryService } from '../services/summaryService';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export class SummaryController {
  async getDailySummary(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const date = req.query.date as string;
      const summary = await summaryService.getDailySummary(userId, date);
      sendSuccess(res, 'Daily summary retrieved successfully', summary);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getWeeklySummary(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const startDate = req.query.startDate as string;
      const summary = await summaryService.getWeeklySummary(userId, startDate);
      sendSuccess(res, 'Weekly summary retrieved successfully', summary);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}

export const summaryController = new SummaryController();
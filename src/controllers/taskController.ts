import { Response, NextFunction } from 'express';
import { taskService } from '../services/taskService';
import { sendSuccess, sendError } from '../utils/response';
import { CreateTaskRequest, UpdateTaskRequest } from '../types/task';
import { AuthenticatedRequest } from '../middleware/auth';

export class TaskController {
  async createTask(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const data: CreateTaskRequest = req.body;
      const task = await taskService.createTask(userId, data);
      sendSuccess(res, 'Task created successfully', task, 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getTasks(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const tasks = await taskService.getTasks(userId);
      sendSuccess(res, 'Tasks retrieved successfully', tasks);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getTaskById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const taskId = req.params.id;
      const task = await taskService.getTaskById(userId, taskId);
      sendSuccess(res, 'Task retrieved successfully', task);
    } catch (error: any) {
      sendError(res, error.message, 404);
    }
  }

  async updateTask(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const taskId = req.params.id;
      const data: UpdateTaskRequest = req.body;
      const task = await taskService.updateTask(userId, taskId, data);
      sendSuccess(res, 'Task updated successfully', task);
    } catch (error: any) {
      sendError(res, error.message, 404);
    }
  }

  async deleteTask(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const taskId = req.params.id;
      const result = await taskService.deleteTask(userId, taskId);
      sendSuccess(res, result.message);
    } catch (error: any) {
      sendError(res, error.message, 404);
    }
  }
}

export const taskController = new TaskController();
import prisma from "../config/database";
import { CreateTaskRequest, UpdateTaskRequest } from "../types/task";
import { aiService } from "./aiService";

class TaskService {
  async createTask(userId: string, data: CreateTaskRequest) {
    let title = data.title;
    let description = data.description;

    if (data.useAI && data.title) {
      try {
        const aiSuggestion = await aiService.generateTaskSuggestion(data.title);
        title = aiSuggestion.title;
        description = aiSuggestion.description;
      } catch (error) {
        console.error("AI enhanced faile, using original input");
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        userId,
      },
      include: {
        timeLogs: true,
      },
    });
    return task;
  }

  async getTasks(userId: string) {
    const tasks = await prisma.task.findMany({
      where: { userId },
      include: {
        timeLogs: {
          where: { endTime: { not: null } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate total time for each task
    const tasksWithTime = tasks.map(task => {
      const totalTime = task.timeLogs.reduce((total, log) => {
        return total + (log.duration || 0);
      }, 0);

      return {
        ...task,
        totalTime,
        timeLogs: undefined, // Remove timeLogs from response
      };
    });

    return tasksWithTime;
  }

  async getTaskById(userId: string, taskId: string) {
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
      include: {
        timeLogs: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    return task;
  }

  async updateTask(userId: string, taskId: string, data: UpdateTaskRequest) {
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data,
    });

    return updatedTask;
  }

  async deleteTask(userId: string, taskId: string) {
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    return { message: 'Task deleted successfully' };
  }
}

export const taskService = new TaskService();

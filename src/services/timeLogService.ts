import prisma from '../config/database';

class TimeLogService {
  async startTimer(userId: string, taskId: string) {
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    // Check if there's already an active timer for this user
    const activeTimer = await prisma.timeLog.findFirst({
      where: { userId, endTime: null },
    });

    if (activeTimer) {
      throw new Error('You already have an active timer. Please stop it first.');
    }

    // Update task status to IN_PROGRESS
    await prisma.task.update({
      where: { id: taskId },
      data: { status: 'IN_PROGRESS' },
    });

    const timeLog = await prisma.timeLog.create({
      data: {
        taskId,
        userId,
        startTime: new Date(),
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return timeLog;
  }

  async stopTimer(userId: string, timeLogId: string) {
    const timeLog = await prisma.timeLog.findFirst({
      where: { id: timeLogId, userId },
      include: {
        task: true,
      },
    });

    if (!timeLog) {
      throw new Error('Timer not found');
    }

    if (timeLog.endTime) {
      throw new Error('Timer already stopped');
    }

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - timeLog.startTime.getTime()) / 1000);

    const updatedTimeLog = await prisma.timeLog.update({
      where: { id: timeLogId },
      data: {
        endTime,
        duration,
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return updatedTimeLog;
  }

  async getActiveTimer(userId: string) {
    const activeTimer = await prisma.timeLog.findFirst({
      where: { userId, endTime: null },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

    return activeTimer;
  }

  async getTimeLogs(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const timeLogs = await prisma.timeLog.findMany({
      where: { userId },
      include: {
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    const total = await prisma.timeLog.count({
      where: { userId },
    });

    return {
      timeLogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async deleteTimeLog(userId: string, timeLogId: string) {
    const timeLog = await prisma.timeLog.findFirst({
      where: { id: timeLogId, userId },
    });

    if (!timeLog) {
      throw new Error('Time log not found');
    }

    await prisma.timeLog.delete({
      where: { id: timeLogId },
    });

    return { message: 'Time log deleted successfully' };
  }
}

export const timeLogService = new TimeLogService();
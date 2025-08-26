import prisma from '../config/database';

class SummaryService {
  async getDailySummary(userId: string, date?: string) {
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const timeLogs = await prisma.timeLog.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        endTime: { not: null },
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    });

    const tasksWorkedOn = await prisma.task.findMany({
      where: {
        userId,
        timeLogs: {
          some: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        },
      },
      include: {
        timeLogs: {
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
            endTime: { not: null },
          },
        },
      },
    });

    const totalTimeTracked = timeLogs.reduce((total, log) => {
      return total + (log.duration || 0);
    }, 0);

    const completedTasks = await prisma.task.findMany({
      where: {
        userId,
        status: 'COMPLETED',
        updatedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const pendingTasks = await prisma.task.count({
      where: { userId, status: 'PENDING' },
    });

    const inProgressTasks = await prisma.task.count({
      where: { userId, status: 'IN_PROGRESS' },
    });

    const taskTimeMap = new Map();
    tasksWorkedOn.forEach(task => {
      const totalTime = task.timeLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
      taskTimeMap.set(task.id, totalTime);
    });

    const summary = {
      date: targetDate.toISOString().split('T')[0],
      totalTimeTracked,
      totalTimeTrackedFormatted: this.formatDuration(totalTimeTracked),
      tasksWorkedOn: tasksWorkedOn.map(task => ({
        id: task.id,
        title: task.title,
        status: task.status,
        timeSpent: taskTimeMap.get(task.id) || 0,
        timeSpentFormatted: this.formatDuration(taskTimeMap.get(task.id) || 0),
      })),
      completedTasks: completedTasks.length,
      pendingTasks,
      inProgressTasks,
      timeLogCount: timeLogs.length,
    };

    return summary;
  }

  async getWeeklySummary(userId: string, startDate?: string) {
    const start = startDate ? new Date(startDate) : new Date();
    start.setHours(0, 0, 0, 0);
    
    const dayOfWeek = start.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    start.setDate(start.getDate() + mondayOffset);

    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    const timeLogs = await prisma.timeLog.findMany({
      where: {
        userId,
        createdAt: {
          gte: start,
          lte: end,
        },
        endTime: { not: null },
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    });

    const totalTimeTracked = timeLogs.reduce((total, log) => {
      return total + (log.duration || 0);
    }, 0);

    const completedTasks = await prisma.task.count({
      where: {
        userId,
        status: 'COMPLETED',
        updatedAt: {
          gte: start,
          lte: end,
        },
      },
    });

    const dailyBreakdown = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(start);
      currentDay.setDate(start.getDate() + i);
      
      const dayStart = new Date(currentDay);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(currentDay);
      dayEnd.setHours(23, 59, 59, 999);

      const dayLogs = timeLogs.filter(log => 
        log.createdAt >= dayStart && log.createdAt <= dayEnd
      );

      const dayTime = dayLogs.reduce((total, log) => total + (log.duration || 0), 0);

      dailyBreakdown.push({
        date: currentDay.toISOString().split('T')[0],
        timeTracked: dayTime,
        timeTrackedFormatted: this.formatDuration(dayTime),
        sessionsCount: dayLogs.length,
      });
    }

    return {
      weekStart: start.toISOString().split('T')[0],
      weekEnd: end.toISOString().split('T')[0],
      totalTimeTracked,
      totalTimeTrackedFormatted: this.formatDuration(totalTimeTracked),
      completedTasks,
      totalSessions: timeLogs.length,
      dailyBreakdown,
    };
  }

  private formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  }
}

export const summaryService = new SummaryService();
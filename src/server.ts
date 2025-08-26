import app from './app';
import { config } from './config/env';
// import prisma from './config/database';

const startServer = async () => {
  try {
    // Test database connection
//     await prisma.$connect();
//     console.log('✅ Database connected successfully');

    // Start server
    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`🌍 Environment: ${config.nodeEnv}`);
      console.log(`📍 Health check: http://localhost:${config.port}/health`);
      
      if (config.nodeEnv === 'development') {
        console.log(`📚 API Documentation available at:`);
        console.log(`   - Auth: http://localhost:${config.port}/api/auth`);
        console.log(`   - Tasks: http://localhost:${config.port}/api/tasks`);
        console.log(`   - Time Logs: http://localhost:${config.port}/api/time-logs`);
        console.log(`   - Summary: http://localhost:${config.port}/api/summary`);
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};
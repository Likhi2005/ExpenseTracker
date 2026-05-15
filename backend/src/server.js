import app from './app.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';

import { runMigrations } from './database/migrationRunner.js';

// Run database migrations before starting the server
await runMigrations();

const PORT = config.port || 5000;
const NODE_ENV = config.nodeEnv || 'development';

// Start server
const server = app.listen(PORT, () => {
    logger.info(`
        ╔════════════════════════════════════════╗
        ║   🚀 ExpenseTracker API Started        ║
        ╠════════════════════════════════════════╣
        ║   Environment: ${NODE_ENV.toUpperCase().padEnd(20)}    ║
        ║   Port: ${PORT.toString().padEnd(30)} ║
        ║   Time: ${new Date().toLocaleTimeString().padEnd(25)}      ║
        ╚════════════════════════════════════════╝
        `);
});

// ===== GRACEFUL SHUTDOWN =====
const gracefulShutdown = () => {
    logger.warn('🛑 Received shutdown signal, closing server gracefully...');

    server.close(() => {
        logger.info(' Server closed');
        process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// ===== UNHANDLED REJECTIONS & EXCEPTIONS =====
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown();
})

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    gracefulShutdown();
})

export default server;

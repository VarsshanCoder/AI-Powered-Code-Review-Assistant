import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Load environment variables
dotenv.config();

import { logger } from './config/logger';
import { databaseService } from './config/database';
import { redisService } from './config/redis';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimiter';

// Routes
import authRoutes from './routes/auth';

class Application {
  public app: express.Application;
  public server: any;
  public io: Server;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeSocketIO();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));

    // Rate limiting
    this.app.use(generalLimiter);

    // Logging
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('combined', {
        stream: {
          write: (message: string) => logger.info(message.trim())
        }
      }));
    } else {
      this.app.use(morgan('combined', {
        stream: {
          write: (message: string) => logger.info(message.trim())
        }
      }));
    }

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Health check endpoint
    this.app.get('/health', async (req, res) => {
      try {
        const dbHealth = await databaseService.healthCheck();
        const redisHealth = await redisService.healthCheck();

        const health = {
          status: 'ok',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          environment: process.env.NODE_ENV,
          version: process.env.npm_package_version || '1.0.0',
          services: {
            database: dbHealth ? 'healthy' : 'unhealthy',
            redis: redisHealth ? 'healthy' : 'unhealthy',
          }
        };

        const statusCode = dbHealth && redisHealth ? 200 : 503;
        res.status(statusCode).json(health);
      } catch (error) {
        logger.error('Health check failed:', error);
        res.status(503).json({
          status: 'error',
          message: 'Health check failed'
        });
      }
    });
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use('/api/auth', authRoutes);

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        message: 'AI Code Review Assistant API',
        version: '1.0.0',
        documentation: '/api/docs',
        health: '/health'
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);
  }

  private initializeSocketIO(): void {
    // Socket.IO middleware for authentication
    this.io.use((socket, next) => {
      // Add authentication logic here if needed
      next();
    });

    this.io.on('connection', (socket) => {
      logger.info(`Socket connected: ${socket.id}`);

      // Handle real-time events
      socket.on('join-review-session', (sessionId: string) => {
        socket.join(`review-${sessionId}`);
        logger.info(`Socket ${socket.id} joined review session ${sessionId}`);
      });

      socket.on('leave-review-session', (sessionId: string) => {
        socket.leave(`review-${sessionId}`);
        logger.info(`Socket ${socket.id} left review session ${sessionId}`);
      });

      socket.on('chat-message', (data) => {
        socket.to(`review-${data.sessionId}`).emit('chat-message', data);
      });

      socket.on('code-comment', (data) => {
        socket.to(`review-${data.sessionId}`).emit('code-comment', data);
      });

      socket.on('disconnect', () => {
        logger.info(`Socket disconnected: ${socket.id}`);
      });
    });
  }

  public async start(): Promise<void> {
    try {
      // Connect to database
      await databaseService.connect();

      // Connect to Redis
      await redisService.connect();

      const port = process.env.PORT || 3001;
      
      this.server.listen(port, () => {
        logger.info(`Server is running on port ${port}`);
        logger.info(`Environment: ${process.env.NODE_ENV}`);
        logger.info(`Health check: http://localhost:${port}/health`);
      });
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  public async stop(): Promise<void> {
    try {
      logger.info('Shutting down server...');

      // Close Socket.IO connections
      this.io.close();

      // Disconnect from database
      await databaseService.disconnect();

      // Disconnect from Redis
      await redisService.disconnect();

      this.server.close(() => {
        logger.info('Server stopped');
        process.exit(0);
      });
    } catch (error) {
      logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  }
}

// Create and start the application
const app = new Application();

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  app.stop();
});

process.on('SIGINT', () => {
  logger.info('SIGINT received');
  app.stop();
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  app.stop();
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  app.stop();
});

// Start the server
app.start().catch((error) => {
  logger.error('Failed to start application:', error);
  process.exit(1);
});

export default app;
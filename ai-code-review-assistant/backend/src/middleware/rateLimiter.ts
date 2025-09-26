import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { redisService } from '../config/redis';
import { logger } from '../config/logger';

// Create a custom store using Redis
class RedisStore {
  private prefix = 'rl:';

  async increment(key: string): Promise<{ totalHits: number; resetTime?: Date }> {
    try {
      const redisKey = this.prefix + key;
      const client = redisService.getClient();
      
      const multi = client.multi();
      multi.incr(redisKey);
      multi.ttl(redisKey);
      
      const results = await multi.exec();
      
      if (!results) {
        throw new Error('Redis transaction failed');
      }
      
      const totalHits = results[0] as number;
      const ttl = results[1] as number;
      
      // Set expiration if this is the first request
      if (totalHits === 1) {
        const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW || '15') * 60 * 1000;
        await client.expire(redisKey, Math.ceil(windowMs / 1000));
      }
      
      const resetTime = ttl > 0 ? new Date(Date.now() + ttl * 1000) : undefined;
      
      return { totalHits, resetTime };
    } catch (error) {
      logger.error('Redis rate limit store error:', error);
      // Fallback to allowing the request if Redis fails
      return { totalHits: 1 };
    }
  }

  async decrement(key: string): Promise<void> {
    try {
      const redisKey = this.prefix + key;
      const client = redisService.getClient();
      await client.decr(redisKey);
    } catch (error) {
      logger.error('Redis rate limit decrement error:', error);
    }
  }

  async resetKey(key: string): Promise<void> {
    try {
      const redisKey = this.prefix + key;
      const client = redisService.getClient();
      await client.del(redisKey);
    } catch (error) {
      logger.error('Redis rate limit reset error:', error);
    }
  }
}

const redisStore = new RedisStore();

// General API rate limiter
export const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '15') * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: {
    increment: (key: string) => redisStore.increment(key),
    decrement: (key: string) => redisStore.decrement(key),
    resetKey: (key: string) => redisStore.resetKey(key),
  },
  keyGenerator: (req: Request): string => {
    return req.ip || 'unknown';
  },
  handler: (req: Request, res: Response) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Too many requests from this IP, please try again later.',
    });
  },
});

// Strict rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: {
    increment: (key: string) => redisStore.increment(`auth:${key}`),
    decrement: (key: string) => redisStore.decrement(`auth:${key}`),
    resetKey: (key: string) => redisStore.resetKey(`auth:${key}`),
  },
  keyGenerator: (req: Request): string => {
    return req.ip || 'unknown';
  },
  handler: (req: Request, res: Response) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Too many authentication attempts, please try again later.',
    });
  },
});

// AI analysis rate limiter (more restrictive due to resource usage)
export const aiAnalysisLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each user to 50 AI analysis requests per hour
  message: {
    success: false,
    error: 'AI analysis rate limit exceeded. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: {
    increment: (key: string) => redisStore.increment(`ai:${key}`),
    decrement: (key: string) => redisStore.decrement(`ai:${key}`),
    resetKey: (key: string) => redisStore.resetKey(`ai:${key}`),
  },
  keyGenerator: (req: Request): string => {
    // Use user ID if authenticated, otherwise IP
    const authReq = req as any;
    return authReq.user?.id || req.ip || 'unknown';
  },
  handler: (req: Request, res: Response) => {
    const authReq = req as any;
    const identifier = authReq.user?.id || req.ip;
    logger.warn(`AI analysis rate limit exceeded for user/IP: ${identifier}`);
    res.status(429).json({
      success: false,
      error: 'AI analysis rate limit exceeded. Please try again later.',
    });
  },
});

// File upload rate limiter
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each user to 20 uploads per 15 minutes
  message: {
    success: false,
    error: 'Upload rate limit exceeded. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: {
    increment: (key: string) => redisStore.increment(`upload:${key}`),
    decrement: (key: string) => redisStore.decrement(`upload:${key}`),
    resetKey: (key: string) => redisStore.resetKey(`upload:${key}`),
  },
  keyGenerator: (req: Request): string => {
    const authReq = req as any;
    return authReq.user?.id || req.ip || 'unknown';
  },
});

// Webhook rate limiter (very permissive for legitimate webhooks)
export const webhookLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // allow 100 webhook calls per minute
  message: {
    success: false,
    error: 'Webhook rate limit exceeded.',
  },
  standardHeaders: false,
  legacyHeaders: false,
  store: {
    increment: (key: string) => redisStore.increment(`webhook:${key}`),
    decrement: (key: string) => redisStore.decrement(`webhook:${key}`),
    resetKey: (key: string) => redisStore.resetKey(`webhook:${key}`),
  },
});
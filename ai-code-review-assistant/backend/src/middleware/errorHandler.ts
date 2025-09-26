import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class CustomError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handling middleware
export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';

  // Log error details
  logger.error('Error occurred:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Handle Prisma errors
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        statusCode = 409;
        message = 'A record with this value already exists';
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Record not found';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Foreign key constraint failed';
        break;
      case 'P2021':
        statusCode = 404;
        message = 'Table does not exist';
        break;
      default:
        statusCode = 400;
        message = 'Database operation failed';
    }
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Handle multer errors
  if (error.name === 'MulterError') {
    statusCode = 400;
    if (error.message.includes('File too large')) {
      message = 'File size too large';
    } else if (error.message.includes('Unexpected field')) {
      message = 'Unexpected file field';
    } else {
      message = 'File upload error';
    }
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Internal Server Error';
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      details: error
    })
  });
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Common error creators
export const createError = (message: string, statusCode: number) => {
  return new CustomError(message, statusCode);
};

export const createValidationError = (message: string) => {
  return new CustomError(message, 400);
};

export const createNotFoundError = (resource: string) => {
  return new CustomError(`${resource} not found`, 404);
};

export const createUnauthorizedError = (message = 'Unauthorized') => {
  return new CustomError(message, 401);
};

export const createForbiddenError = (message = 'Forbidden') => {
  return new CustomError(message, 403);
};

export const createConflictError = (message: string) => {
  return new CustomError(message, 409);
};

export const createInternalError = (message = 'Internal Server Error') => {
  return new CustomError(message, 500, false);
};
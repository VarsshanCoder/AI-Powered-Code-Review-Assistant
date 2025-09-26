import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { asyncHandler, createValidationError, createUnauthorizedError } from '../middleware/errorHandler';
import { AuthenticatedRequest, LoginCredentials, RegisterData, ApiResponse } from '../types';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, username, password, firstName, lastName }: RegisterData = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username }
      ]
    }
  });

  if (existingUser) {
    throw createValidationError('User with this email or username already exists');
  }

  // Hash password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      firstName,
      lastName,
    },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      avatar: true,
      role: true,
      createdAt: true,
    }
  });

  // Generate JWT token
  const jwtSecret = process.env.JWT_SECRET!;
  const token = jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    },
    jwtSecret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  logger.info(`New user registered: ${user.email}`);

  const response: ApiResponse = {
    success: true,
    data: {
      user,
      token
    },
    message: 'User registered successfully'
  };

  res.status(201).json(response);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: LoginCredentials = req.body;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      username: true,
      password: true,
      firstName: true,
      lastName: true,
      avatar: true,
      role: true,
      isActive: true,
    }
  });

  if (!user) {
    throw createUnauthorizedError('Invalid credentials');
  }

  if (!user.isActive) {
    throw createUnauthorizedError('Account is deactivated');
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw createUnauthorizedError('Invalid credentials');
  }

  // Generate JWT token
  const jwtSecret = process.env.JWT_SECRET!;
  const token = jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    },
    jwtSecret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  // Log activity
  await prisma.activityLog.create({
    data: {
      userId: user.id,
      action: 'LOGIN',
      resource: 'auth',
    }
  });

  logger.info(`User logged in: ${user.email}`);

  const { password: _, ...userWithoutPassword } = user;

  const response: ApiResponse = {
    success: true,
    data: {
      user: userWithoutPassword,
      token
    },
    message: 'Login successful'
  };

  res.json(response);
});

export const logout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (req.user) {
    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: 'LOGOUT',
        resource: 'auth',
      }
    });

    logger.info(`User logged out: ${req.user.email}`);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Logout successful'
  };

  res.json(response);
});

export const getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      avatar: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      organizations: {
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              slug: true,
              avatar: true,
            }
          }
        }
      },
      repositories: {
        select: {
          id: true,
          name: true,
          fullName: true,
          language: true,
          isPrivate: true,
        },
        take: 10,
        orderBy: {
          updatedAt: 'desc'
        }
      },
      _count: {
        select: {
          reviews: true,
          comments: true,
          repositories: true,
        }
      }
    }
  });

  if (!user) {
    throw createUnauthorizedError('User not found');
  }

  const response: ApiResponse = {
    success: true,
    data: user
  };

  res.json(response);
});

export const updateProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { firstName, lastName, avatar } = req.body;

  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: {
      firstName,
      lastName,
      avatar,
    },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      avatar: true,
      role: true,
      updatedAt: true,
    }
  });

  logger.info(`User profile updated: ${user.email}`);

  const response: ApiResponse = {
    success: true,
    data: user,
    message: 'Profile updated successfully'
  };

  res.json(response);
});

export const changePassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  // Get current user with password
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      password: true,
    }
  });

  if (!user) {
    throw createUnauthorizedError('User not found');
  }

  // Verify current password
  const isValidPassword = await bcrypt.compare(currentPassword, user.password);
  if (!isValidPassword) {
    throw createUnauthorizedError('Current password is incorrect');
  }

  // Hash new password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  // Update password
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
    }
  });

  logger.info(`Password changed for user: ${req.user!.email}`);

  const response: ApiResponse = {
    success: true,
    message: 'Password changed successfully'
  };

  res.json(response);
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw createUnauthorizedError('Refresh token required');
  }

  try {
    const jwtSecret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(refreshToken, jwtSecret) as any;

    // Generate new access token
    const newToken = jwt.sign(
      { 
        userId: decoded.userId, 
        email: decoded.email, 
        role: decoded.role 
      },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const response: ApiResponse = {
      success: true,
      data: {
        token: newToken
      }
    };

    res.json(response);
  } catch (error) {
    throw createUnauthorizedError('Invalid refresh token');
  }
});

export const deleteAccount = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { password } = req.body;

  // Get current user with password
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      email: true,
      password: true,
    }
  });

  if (!user) {
    throw createUnauthorizedError('User not found');
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw createUnauthorizedError('Password is incorrect');
  }

  // Soft delete user (deactivate account)
  await prisma.user.update({
    where: { id: user.id },
    data: {
      isActive: false,
      email: `deleted_${Date.now()}_${user.email}`, // Prevent email conflicts
    }
  });

  logger.info(`User account deleted: ${user.email}`);

  const response: ApiResponse = {
    success: true,
    message: 'Account deleted successfully'
  };

  res.json(response);
});
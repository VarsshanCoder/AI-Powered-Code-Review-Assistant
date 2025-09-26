import { Request, Response, NextFunction } from 'express';
import { body, param, query, ValidationChain, validationResult } from 'express-validator';
import { logger } from '../config/logger';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation errors:', errors.array());
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Auth validation rules
export const validateRegister: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('username')
    .isLength({ min: 3, max: 50 })
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username must be 3-50 characters and contain only letters, numbers, hyphens, and underscores'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be at least 8 characters with uppercase, lowercase, number, and special character'),
  body('firstName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be 1-50 characters'),
  body('lastName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be 1-50 characters')
];

export const validateLogin: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Repository validation rules
export const validateRepositoryConnection: ValidationChain[] = [
  body('provider')
    .isIn(['github', 'gitlab', 'bitbucket'])
    .withMessage('Provider must be github, gitlab, or bitbucket'),
  body('accessToken')
    .notEmpty()
    .withMessage('Access token is required'),
  body('repositoryUrl')
    .isURL()
    .withMessage('Valid repository URL is required')
];

// Review validation rules
export const validateCreateReview: ValidationChain[] = [
  body('repositoryId')
    .isUUID()
    .withMessage('Valid repository ID is required'),
  body('type')
    .isIn(['AUTOMATED', 'MANUAL', 'HYBRID'])
    .withMessage('Review type must be AUTOMATED, MANUAL, or HYBRID'),
  body('fileId')
    .optional()
    .isUUID()
    .withMessage('File ID must be a valid UUID'),
  body('pullRequestId')
    .optional()
    .isUUID()
    .withMessage('Pull request ID must be a valid UUID'),
  body('commitId')
    .optional()
    .isUUID()
    .withMessage('Commit ID must be a valid UUID')
];

export const validateAddComment: ValidationChain[] = [
  body('content')
    .isLength({ min: 1, max: 5000 })
    .withMessage('Comment content must be 1-5000 characters'),
  body('type')
    .isIn(['BUG', 'IMPROVEMENT', 'SUGGESTION', 'QUESTION', 'PRAISE', 'SECURITY', 'PERFORMANCE'])
    .withMessage('Invalid comment type'),
  body('severity')
    .isIn(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'])
    .withMessage('Invalid severity level'),
  body('lineStart')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Line start must be a positive integer'),
  body('lineEnd')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Line end must be a positive integer')
];

// Custom rule validation rules
export const validateCustomRule: ValidationChain[] = [
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('Rule name must be 1-100 characters'),
  body('pattern')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Pattern must be 1-1000 characters'),
  body('severity')
    .isIn(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'])
    .withMessage('Invalid severity level'),
  body('message')
    .isLength({ min: 1, max: 500 })
    .withMessage('Message must be 1-500 characters'),
  body('language')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Language must be 1-50 characters')
];

// Organization validation rules
export const validateCreateOrganization: ValidationChain[] = [
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('Organization name must be 1-100 characters'),
  body('slug')
    .isLength({ min: 3, max: 50 })
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug must be 3-50 characters and contain only lowercase letters, numbers, and hyphens'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be at most 500 characters')
];

// Integration validation rules
export const validateIntegration: ValidationChain[] = [
  body('type')
    .isIn(['SLACK', 'TEAMS', 'EMAIL', 'WEBHOOK', 'GITHUB_APP', 'GITLAB_APP', 'BITBUCKET_APP'])
    .withMessage('Invalid integration type'),
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('Integration name must be 1-100 characters'),
  body('settings')
    .isObject()
    .withMessage('Settings must be an object')
];

// Common parameter validations
export const validateUUID = (paramName: string): ValidationChain => 
  param(paramName).isUUID().withMessage(`${paramName} must be a valid UUID`);

export const validatePagination: ValidationChain[] = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sort')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'name', 'score'])
    .withMessage('Invalid sort field'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be asc or desc')
];

// File upload validation
export const validateFileUpload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const maxSize = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB default
  
  if (req.file && req.file.size > maxSize) {
    return res.status(400).json({
      success: false,
      error: `File size must be less than ${maxSize / 1048576}MB`
    });
  }
  
  next();
};
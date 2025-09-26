import { Router } from 'express';
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  refreshToken,
  deleteAccount,
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';
import {
  validateRegister,
  validateLogin,
  handleValidationErrors,
} from '../middleware/validation';

const router = Router();

// Public routes
router.post('/register', authLimiter, validateRegister, handleValidationErrors, register);
router.post('/login', authLimiter, validateLogin, handleValidationErrors, login);
router.post('/refresh-token', refreshToken);

// Protected routes
router.use(authenticateToken);

router.post('/logout', logout);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.delete('/account', deleteAccount);

export default router;
import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, refresh, logout } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';

export const authRouter = Router();

const validRoles = ['owner', 'employer', 'developer', 'user'];
const validCategories = ['national', 'business', 'sports', 'entertainment', 'technology', 'politics', 'world', 'lifestyle', 'health', 'education'];

authRouter.post(
  '/register',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Full name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('role')
      .optional()
      .isIn(validRoles)
      .withMessage(`Role must be one of: ${validRoles.join(', ')}`),
    body('categories')
      .optional()
      .isArray()
      .withMessage('Categories must be an array'),
    body('categories.*')
      .optional()
      .isIn(validCategories)
      .withMessage(`Each category must be one of: ${validCategories.join(', ')}`),
    validateRequest
  ],
  register
);

authRouter.post(
  '/login',
  [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
    validateRequest
  ],
  login
);

authRouter.post(
  '/refresh',
  [
    body('refreshToken')
      .notEmpty()
      .withMessage('Refresh token is required'),
    validateRequest
  ],
  refresh
);

authRouter.post('/logout', logout);


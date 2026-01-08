import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, refresh } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
export const authRouter = Router();
authRouter.post('/register', body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 }), validateRequest, register);
authRouter.post('/login', body('email').isEmail(), body('password').notEmpty(), validateRequest, login);
authRouter.post('/refresh', body('refreshToken').notEmpty(), validateRequest, refresh);

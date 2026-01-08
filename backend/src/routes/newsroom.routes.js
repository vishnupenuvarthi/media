import { Router } from 'express';
import { getDashboard } from '../controllers/newsroom.controller.js';

export const newsroomRouter = Router();

newsroomRouter.get('/dashboard', getDashboard);

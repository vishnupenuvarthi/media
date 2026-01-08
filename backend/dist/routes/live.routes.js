import { Router } from 'express';
import { getLiveBlog } from '../controllers/live.controller.js';
export const liveRouter = Router();
liveRouter.get('/:slug', getLiveBlog);

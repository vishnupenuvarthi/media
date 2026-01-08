import { Router } from 'express';
import { getCategory } from '../controllers/category.controller.js';

export const categoryRouter = Router();

categoryRouter.get('/:slug', getCategory);

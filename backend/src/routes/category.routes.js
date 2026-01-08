import { Router } from 'express';
import { getCategory, getCategoryByTag } from '../controllers/category.controller.js';

export const categoryRouter = Router();

// Tag-based categories (cities, budget, elections, podcasts, explainers, photos, videos)
categoryRouter.get('/tag/:tag', getCategoryByTag);

// Regular category by slug
categoryRouter.get('/:slug', getCategory);

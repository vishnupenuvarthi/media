import { Router } from 'express';
import { getCategory, getCategoryByTag, getAllCategories } from '../controllers/category.controller.js';

export const categoryRouter = Router();

// Get all categories (public, no auth required)
categoryRouter.get('/', getAllCategories);

// Tag-based categories (cities, budget, elections, podcasts, explainers, photos, videos)
categoryRouter.get('/tag/:tag', getCategoryByTag);

// Regular category by slug
categoryRouter.get('/:slug', getCategory);

import { Router } from 'express';
import { getArticle, listArticles } from '../controllers/article.controller.js';
export const articleRouter = Router();
articleRouter.get('/', listArticles);
articleRouter.get('/:slug', getArticle);

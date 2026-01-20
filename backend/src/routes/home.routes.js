import { Router } from 'express';
import { getHomeFeed, getYouTubeFeed } from '../controllers/home.controller.js';

export const homeRouter = Router();

homeRouter.get('/', getHomeFeed);
homeRouter.get('/youtube', getYouTubeFeed);

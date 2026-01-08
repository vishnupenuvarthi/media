import { Router } from 'express';
import { getHomeFeed } from '../controllers/home.controller.js';

export const homeRouter = Router();

homeRouter.get('/', getHomeFeed);

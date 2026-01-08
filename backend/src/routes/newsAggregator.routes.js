import { Router } from 'express';
import {
  aggregateNewsByLanguage,
  aggregateAllNewsHandler,
  getAggregationStatus
} from '../controllers/newsAggregator.controller.js';

export const newsAggregatorRouter = Router();

// Public route to trigger aggregation (can be protected if needed)
newsAggregatorRouter.post('/aggregate/:language', aggregateNewsByLanguage);
newsAggregatorRouter.post('/aggregate', aggregateAllNewsHandler);
newsAggregatorRouter.get('/status', getAggregationStatus);



import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import oauthRouter from './oauth.routes.js';
import { articleRouter } from './article.routes.js';
import { categoryRouter } from './category.routes.js';
import { homeRouter } from './home.routes.js';
import { liveRouter } from './live.routes.js';
import { newsroomRouter } from './newsroom.routes.js';
import { calendarRouter } from './calendar.routes.js';
import { newsAggregatorRouter } from './newsAggregator.routes.js';

export const router = Router();

router.use('/auth', authRouter);
router.use('/auth', oauthRouter);
router.use('/home', homeRouter);
router.use('/articles', articleRouter);
router.use('/categories', categoryRouter);
router.use('/live', liveRouter);
router.use('/newsroom', newsroomRouter);
router.use('/calendar', calendarRouter);
router.use('/news-aggregator', newsAggregatorRouter);


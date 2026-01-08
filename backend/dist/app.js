import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { articleRouter } from './routes/article.routes.js';
import { homeRouter } from './routes/home.routes.js';
import { liveRouter } from './routes/live.routes.js';
import { categoryRouter } from './routes/category.routes.js';
import { newsroomRouter } from './routes/newsroom.routes.js';
const app = express();
app.use(cors({
    origin: env.frontendUrl,
    credentials: true
}));
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));
app.use('/api/home', homeRouter);
app.use('/api/articles', articleRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/live', liveRouter);
app.use('/api/newsroom', newsroomRouter);
app.use(errorHandler);
export { app };

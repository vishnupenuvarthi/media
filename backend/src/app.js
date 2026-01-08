import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from './config/passport.js';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { articleRouter } from './routes/article.routes.js';
import { homeRouter } from './routes/home.routes.js';
import { liveRouter } from './routes/live.routes.js';
import { categoryRouter } from './routes/category.routes.js';
import { newsroomRouter } from './routes/newsroom.routes.js';
import { calendarRouter } from './routes/calendar.routes.js';
import { authRouter } from './routes/auth.routes.js';
import oauthRouter from './routes/oauth.routes.js';
import { newsAggregatorRouter } from './routes/newsAggregator.routes.js';

const app = express();

// CORS configuration - allow OAuth redirects
const allowedOrigins = [
  env.frontendUrl,
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000'
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman, or OAuth redirects)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list
      if (allowedOrigins.some(allowed => origin.includes(allowed.replace('http://', '').replace('https://', '')))) {
        callback(null, true);
      } else {
        // For OAuth callbacks, be more permissive
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: env.jwtSecret || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: env.nodeEnv === 'production', httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRouter);
app.use('/api/auth', oauthRouter);
app.use('/api/home', homeRouter);
app.use('/api/articles', articleRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/live', liveRouter);
app.use('/api/newsroom', newsroomRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/news-aggregator', newsAggregatorRouter);

app.use(errorHandler);

export { app };

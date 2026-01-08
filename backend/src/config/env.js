import dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const required = (value, key) => {
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 5000),
  mongoUri: required(process.env.MONGO_URI, 'MONGO_URI'),
  jwtSecret: required(process.env.JWT_SECRET, 'JWT_SECRET'),
  jwtRefreshSecret: required(process.env.JWT_REFRESH_SECRET, 'JWT_REFRESH_SECRET'),
  frontendUrl: process.env.FRONTEND_URL ?? process.env.CLIENT_URL ?? 'http://localhost:5173'
};

import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';
export const connectDatabase = async () => {
    try {
        await mongoose.connect(env.mongoUri);
        logger.info('MongoDB connected');
    }
    catch (err) {
        logger.error({ err }, 'Mongo connection failed');
        process.exit(1);
    }
};

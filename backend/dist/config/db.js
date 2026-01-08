import mongoose from 'mongoose';
import { env } from './env.js';
export const connectDb = async () => {
    try {
        await mongoose.connect(env.mongoUri);
        if (env.nodeEnv !== 'test') {
            console.log('MongoDB connected');
        }
    }
    catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
    }
};

import mongoose from 'mongoose';
import { env } from './env.js';

let isConnected = false;
let retryCount = 0;
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;

const connectWithRetry = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority',
    };

    const conn = await mongoose.connect(env.mongoUri, options);

    isConnected = true;
    retryCount = 0;

    if (env.nodeEnv !== 'test') {
      console.log('✅ MongoDB connected successfully');
      console.log('📂 Database:', conn.connection.name);
    }

  } catch (error) {
    retryCount++;
    console.error(
      `❌ Failed to connect to MongoDB (Attempt ${retryCount}/${MAX_RETRIES}):`,
      error.message
    );

    if (retryCount < MAX_RETRIES) {
      console.log(`⏳ Retrying connection in ${RETRY_DELAY / 1000} seconds...`);
      setTimeout(connectWithRetry, RETRY_DELAY);
    } else {
      console.error('⚠️  Max retries reached. DB unavailable.');
      isConnected = false;
    }
  }
};

export const connectDb = async () => {
  await connectWithRetry();

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB runtime error:', err.message);
    isConnected = false;
  });

  mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnected');
    isConnected = true;
    retryCount = 0;
  });
};

export const isDbConnected = () => isConnected;

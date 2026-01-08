import mongoose from 'mongoose';
import { env } from './env.js';

let isConnected = false;
let retryCount = 0;
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

const connectWithRetry = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    };
    
    await mongoose.connect(env.mongoUri, options);
    isConnected = true;
    retryCount = 0;
    
    if (env.nodeEnv !== 'test') {
      console.log('✅ MongoDB connected successfully');
      console.log('Database:', mongoose.connection.db.databaseName);
    }
  } catch (error) {
    retryCount++;
    console.error(`❌ Failed to connect to MongoDB (Attempt ${retryCount}/${MAX_RETRIES}):`, error.message);
    
    if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.error('\n⚠️  IP Whitelist Issue Detected!');
      console.error('Please add your current IP address to MongoDB Atlas IP whitelist:');
      console.error('https://www.mongodb.com/docs/atlas/security-whitelist/');
      console.error('\nTo allow all IPs (less secure, for development only):');
      console.error('Add 0.0.0.0/0 to your Atlas IP whitelist');
    }
    
    if (retryCount < MAX_RETRIES) {
      console.log(`⏳ Retrying connection in ${RETRY_DELAY / 1000} seconds...`);
      setTimeout(connectWithRetry, RETRY_DELAY);
    } else {
      console.error('\n⚠️  Maximum retry attempts reached. Server will start but database operations may fail.');
      console.error('Connection string:', env.mongoUri.replace(/\/\/.*@/, '//***:***@'));
      console.error('\n💡 Tip: Fix MongoDB connection and restart the server for full functionality.');
      // Don't exit - allow server to start without DB for now
      isConnected = false;
    }
  }
};

export const connectDb = async () => {
  await connectWithRetry();
  
  // Handle connection events
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
    isConnected = false;
  });
  
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    isConnected = false;
    if (retryCount < MAX_RETRIES) {
      setTimeout(connectWithRetry, RETRY_DELAY);
    }
  });
  
  mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnected');
    isConnected = true;
    retryCount = 0;
  });
};

export const isDbConnected = () => isConnected;


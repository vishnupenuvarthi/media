import cron from 'node-cron';
import { aggregateAllNews } from './newsAggregator.service.js';

let isRunning = false;

/**
 * Run news aggregation
 */
const runAggregation = async () => {
  if (isRunning) {
    console.log('News aggregation already running, skipping...');
    return;
  }
  
  isRunning = true;
  console.log('Starting scheduled news aggregation...');
  
  try {
    const results = await aggregateAllNews();
    console.log('Scheduled aggregation completed:', results);
  } catch (error) {
    console.error('Error in scheduled news aggregation:', error);
  } finally {
    isRunning = false;
  }
};

/**
 * Initialize scheduled news aggregation
 * - Runs every 30 minutes
 */
export const startNewsScheduler = () => {
  console.log('📅 Starting news aggregation scheduler...');
  
  // Run immediately on startup
  runAggregation();
  
  // Schedule to run every 30 minutes
  cron.schedule('*/30 * * * *', () => {
    console.log('⏰ Scheduled news aggregation triggered');
    runAggregation();
  });
  
  console.log('✅ News aggregation scheduled to run every 30 minutes');
};

/**
 * Stop the scheduler (for testing/cleanup)
 */
export const stopNewsScheduler = () => {
  // Cron jobs don't have a built-in stop method in node-cron
  // This is a placeholder for future implementation if needed
  console.log('News scheduler stop requested');
};



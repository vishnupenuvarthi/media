import { app } from './app.js';
import { connectDb, isDbConnected } from './config/db.js';
import { env } from './config/env.js';
import { startNewsScheduler } from './services/newsScheduler.service.js';

const start = async () => {
  // Start database connection (non-blocking)
  connectDb().catch((err) => {
    console.error('Database connection initialization error:', err);
  });
  
  // Start news aggregation scheduler only if DB is connected
  if (env.nodeEnv !== 'test') {
    // Wait a bit for DB connection, then start scheduler
    setTimeout(() => {
      if (isDbConnected()) {
        startNewsScheduler();
      } else {
        console.warn('⚠️  News scheduler not started - database not connected');
      }
    }, 2000);
  }
  
  const port = env.port || process.env.PORT || 5000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${port}`);
    if (!isDbConnected()) {
      console.warn('⚠️  Server started but database is not connected. Some features may not work.');
    }
  });
};

start();

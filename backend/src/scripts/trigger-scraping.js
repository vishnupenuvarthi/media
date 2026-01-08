import { connectDb } from '../config/db.js';
import { aggregateAllNews } from '../services/newsAggregator.service.js';

const run = async () => {
  console.log('🔄 Starting manual news aggregation...');
  
  await connectDb();
  
  console.log('✅ Database connected');
  console.log('📰 Fetching news from RSS feeds...');
  
  try {
    const results = await aggregateAllNews();
    
    console.log('\n✅ Aggregation completed!');
    console.log('📊 Results:');
    console.log(`   Telugu: ${results.te.saved} saved, ${results.te.skipped} skipped`);
    console.log(`   English: ${results.en.saved} saved, ${results.en.skipped} skipped`);
    console.log(`   Total: ${results.te.total + results.en.total} articles found`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during aggregation:', error);
    process.exit(1);
  }
};

run();


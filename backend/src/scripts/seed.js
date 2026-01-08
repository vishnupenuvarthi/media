import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDb } from '../config/db.js';
import { CategoryModel } from '../models/category.model.js';
import { ArticleModel } from '../models/article.model.js';
import { LiveBlogModel } from '../models/liveBlog.model.js';
import { UserModel } from '../models/user.model.js';
import { CalendarEventModel } from '../models/calendarEvent.model.js';

const run = async () => {
  await connectDb();

  // Fix old unique index on oauthProvider/oauthId that was causing seed failures
  // It's safe to drop here; normal users don't need this uniqueness constraint
  try {
    await UserModel.collection.dropIndex('oauthProvider_1_oauthId_1');
    console.log('✅ Dropped oauthProvider_1_oauthId_1 index on users collection');
  } catch (err) {
    if (err.codeName !== 'IndexNotFound') {
      console.warn('⚠️ Could not drop oauthProvider_1_oauthId_1 index:', err.message);
    }
  }
  await Promise.all([
    CategoryModel.deleteMany({}),
    ArticleModel.deleteMany({}),
    LiveBlogModel.deleteMany({}),
    UserModel.deleteMany({}),
    CalendarEventModel.deleteMany({})
  ]);

  const categories = await CategoryModel.insertMany([
    { title: 'India', slug: 'india', description: 'National news, politics and policy updates from India.' },
    { title: 'World', slug: 'world', description: 'International news and global affairs.' },
    { title: 'Business', slug: 'business', description: 'Markets, startups and economy.' },
    { title: 'Markets', slug: 'markets', description: 'Stock markets, commodities and financial news.' },
    { title: 'Tech', slug: 'tech', description: 'Technology, startups, innovation and digital news.' },
    { title: 'Sports', slug: 'sports', description: 'Cricket, football, Olympics and sports updates.' },
    { title: 'Entertainment', slug: 'entertainment', description: 'Movies, TV, music and celebrity news.' },
    { title: 'Lifestyle', slug: 'lifestyle', description: 'Fashion, food, travel and lifestyle trends.' },
    { title: 'Opinion', slug: 'opinion', description: 'Editorials, columns and opinion pieces.' },
    { title: 'Politics', slug: 'politics', description: 'Political news and analysis.' },
    { title: 'Technology', slug: 'technology', description: 'Startups, policy, innovation.' }
  ]);

  const [india, world, business, markets, tech, sports, entertainment, lifestyle, opinion, politics] = categories;

  const passwordHash = await bcrypt.hash('newsroom@123', 10);

  const [reporter, editor] = await UserModel.insertMany([
    { email: 'reporter@bharatbulletin.com', passwordHash, role: 'user', profile: { name: 'Anita Rao' } },
    { email: 'editor@bharatbulletin.com', passwordHash, role: 'owner', profile: { name: 'Vikram Patel' } }
  ]);

  // Realistic article titles and content for each category
  const articleTemplates = {
    india: [
      { title: 'Prime Minister Announces New Infrastructure Projects Worth ₹50,000 Crore', summary: 'Major infrastructure boost for rural connectivity and urban development across multiple states.', image: '1520607162513' },
      { title: 'Supreme Court Upholds Key Constitutional Amendment', summary: 'Landmark decision strengthens federal structure and state rights.', image: '1500530855697' },
      { title: 'Record Voter Turnout in State Elections', summary: 'Citizens show strong participation in democratic process.', image: '1457369804613' },
      { title: 'New Education Policy Implementation Begins', summary: 'Transformative changes in curriculum and teaching methods.', image: '1469474968028' },
      { title: 'Digital India Initiative Reaches 100 Million Users', summary: 'Massive adoption of digital services across rural and urban areas.', image: '1454496522488' }
    ],
    world: [
      { title: 'Global Climate Summit Reaches Historic Agreement', summary: 'World leaders commit to ambitious carbon reduction targets.', image: '1500530855697' },
      { title: 'International Trade Deal Signed Between Major Economies', summary: 'New partnership expected to boost global commerce.', image: '1520607162513' },
      { title: 'UN Security Council Addresses Regional Conflicts', summary: 'Diplomatic efforts intensify to resolve ongoing tensions.', image: '1457369804613' },
      { title: 'Global Tech Giants Announce Joint Initiative', summary: 'Collaboration aims to address digital divide worldwide.', image: '1469474968028' },
      { title: 'International Space Mission Launches Successfully', summary: 'Historic collaboration advances space exploration efforts.', image: '1454496522488' }
    ],
    business: [
      { title: 'Stock Market Reaches All-Time High', summary: 'Investor confidence surges as economy shows strong recovery signs.', image: '1520607162513' },
      { title: 'Major Merger Creates New Market Leader', summary: 'Deal valued at billions reshapes industry landscape.', image: '1500530855697' },
      { title: 'Startup Ecosystem Sees Record Funding', summary: 'Venture capital investments reach unprecedented levels.', image: '1457369804613' },
      { title: 'Export Growth Exceeds Expectations', summary: 'Strong performance in international trade boosts economy.', image: '1469474968028' },
      { title: 'Corporate Earnings Beat Analyst Forecasts', summary: 'Companies report strong quarterly results across sectors.', image: '1454496522488' }
    ],
    markets: [
      { title: 'Gold Prices Surge Amid Economic Uncertainty', summary: 'Investors flock to safe-haven assets as markets fluctuate.', image: '1520607162513' },
      { title: 'Cryptocurrency Market Shows Volatility', summary: 'Digital assets experience significant price movements.', image: '1500530855697' },
      { title: 'Commodity Prices Reach New Heights', summary: 'Supply chain disruptions impact global commodity markets.', image: '1457369804613' },
      { title: 'Forex Market Sees Major Currency Shifts', summary: 'Central bank policies drive exchange rate changes.', image: '1469474968028' },
      { title: 'Bond Yields Reflect Economic Outlook', summary: 'Fixed income markets respond to monetary policy changes.', image: '1454496522488' }
    ],
    tech: [
      { title: 'AI Breakthrough Revolutionizes Healthcare', summary: 'New technology enables faster and more accurate diagnoses.', image: '1520607162513' },
      { title: '5G Network Expansion Accelerates', summary: 'Telecom companies roll out next-generation connectivity nationwide.', image: '1500530855697' },
      { title: 'Cybersecurity Threats Increase Globally', summary: 'Experts warn of sophisticated attacks targeting critical infrastructure.', image: '1457369804613' },
      { title: 'Quantum Computing Milestone Achieved', summary: 'Scientists make significant progress in quantum technology.', image: '1469474968028' },
      { title: 'Electric Vehicle Adoption Surges', summary: 'Consumers embrace sustainable transportation options.', image: '1454496522488' }
    ],
    sports: [
      { title: 'Cricket Team Wins Championship Title', summary: 'Historic victory marks team\'s return to glory.', image: '1520607162513' },
      { title: 'Olympic Athletes Break World Records', summary: 'Exceptional performances highlight training and dedication.', image: '1500530855697' },
      { title: 'Football League Sees Intense Competition', summary: 'Top teams battle for championship position.', image: '1457369804613' },
      { title: 'Tennis Grand Slam Tournament Begins', summary: 'World\'s best players compete for prestigious title.', image: '1469474968028' },
      { title: 'Athletics Championship Sets New Standards', summary: 'Athletes push boundaries of human performance.', image: '1454496522488' }
    ],
    entertainment: [
      { title: 'Blockbuster Movie Breaks Box Office Records', summary: 'Audience response exceeds all expectations.', image: '1520607162513' },
      { title: 'Music Festival Attracts Global Artists', summary: 'Celebration of diverse musical genres and cultures.', image: '1500530855697' },
      { title: 'Streaming Platform Launches Original Series', summary: 'New content captivates audiences worldwide.', image: '1457369804613' },
      { title: 'Award Ceremony Honors Industry Excellence', summary: 'Recognition for outstanding contributions to entertainment.', image: '1469474968028' },
      { title: 'Celebrity Collaboration Creates Buzz', summary: 'Unexpected partnership generates excitement among fans.', image: '1454496522488' }
    ],
    lifestyle: [
      { title: 'Wellness Trends Shape Consumer Choices', summary: 'Health-conscious living becomes mainstream priority.', image: '1520607162513' },
      { title: 'Fashion Week Showcases Sustainable Designs', summary: 'Eco-friendly fashion takes center stage.', image: '1500530855697' },
      { title: 'Culinary Innovation Redefines Dining', summary: 'Chefs experiment with fusion and traditional flavors.', image: '1457369804613' },
      { title: 'Travel Destinations Gain Popularity', summary: 'Emerging locations attract adventure seekers.', image: '1469474968028' },
      { title: 'Home Design Trends Focus on Sustainability', summary: 'Eco-conscious architecture transforms living spaces.', image: '1454496522488' }
    ],
    opinion: [
      { title: 'Editorial: The Future of Digital Democracy', summary: 'Analysis of how technology shapes political participation.', image: '1520607162513' },
      { title: 'Opinion: Economic Policies Need Reform', summary: 'Expert perspective on current fiscal challenges.', image: '1500530855697' },
      { title: 'Column: Education System Requires Modernization', summary: 'Thoughtful examination of educational priorities.', image: '1457369804613' },
      { title: 'Analysis: Climate Action Cannot Wait', summary: 'Urgent call for environmental responsibility.', image: '1469474968028' },
      { title: 'Perspective: Social Media\'s Impact on Society', summary: 'Critical look at digital communication trends.', image: '1454496522488' }
    ],
    politics: [
      { title: 'Political Alliance Forms Ahead of Elections', summary: 'Coalition aims to address key voter concerns.', image: '1520607162513' },
      { title: 'Policy Reform Bill Passes Legislature', summary: 'Significant changes to governance structure approved.', image: '1500530855697' },
      { title: 'Public Consultation on Key Legislation', summary: 'Citizens invited to participate in democratic process.', image: '1457369804613' },
      { title: 'Political Leaders Address National Issues', summary: 'Comprehensive discussion on pressing challenges.', image: '1469474968028' },
      { title: 'Electoral Reforms Enhance Transparency', summary: 'New measures strengthen democratic institutions.', image: '1454496522488' }
    ]
  };

  // Generate 80+ articles distributed across all categories with proper Telugu/English mix
  const sampleArticles = [];
  let articleIndex = 0;
  const timestamp = Date.now();
  
  Object.entries(articleTemplates).forEach(([categorySlug, templates]) => {
    const category = categories.find(cat => cat.slug === categorySlug);
    if (!category) return;
    
    templates.forEach((template, templateIdx) => {
      // First 15 articles are breaking news (more breaking news)
      const isBreaking = articleIndex < 15;
      const isTopHeadline = articleIndex < 25;
      // Better distribution: 40% Telugu, 40% English, 20% universal
      const langMod = articleIndex % 5;
      const language = langMod < 2 ? 'te' : langMod < 4 ? 'en' : undefined;
      
      sampleArticles.push({
        title: template.title,
        subTitle: `In-depth coverage and analysis of ${category.title.toLowerCase()} developments`,
        slug: `${category.slug}-${templateIdx + 1}-${timestamp}-${articleIndex}`,
        category: category._id,
        tags: [category.slug, 'latest', 'news'].slice(0, 3),
        summary: template.summary,
        heroImage: `https://picsum.photos/seed/${articleIndex + timestamp}/1200/600`,
        body: `<p>This is a comprehensive article about ${template.title.toLowerCase()}. It provides detailed information, context, and analysis that helps readers understand the full picture of this important ${category.title.toLowerCase()} story.</p><p>The article includes expert opinions, data analysis, and multiple perspectives to give readers a well-rounded understanding of the topic.</p>`,
    status: 'published',
        language,
        author: articleIndex % 2 === 0 ? reporter._id : editor._id,
    editor: editor._id,
        stats: { 
          views: 10000 - (articleIndex * 150), 
          readTime: 4 + (articleIndex % 4), 
          shares: 300 - (articleIndex * 8) 
        },
        flags: { isBreaking, isTopHeadline },
        publishedAt: new Date(Date.now() - (articleIndex * 1_800_000)) // Spread over time
      });
      articleIndex++;
    });
  });
  
  // Add more articles to reach 80+ total with better Telugu distribution
  const extraArticles = [...Array(30)].map((_, idx) => {
    const categoryIndex = idx % 10;
    const category = [india, world, business, markets, tech, sports, entertainment, lifestyle, opinion, politics][categoryIndex];
    const isBreaking = false;
    const isTopHeadline = idx < 10;
    // More Telugu articles in extra set
    const langMod = idx % 3;
    const language = langMod === 0 ? 'te' : langMod === 1 ? 'en' : undefined;
    
    return {
      title: `${category.title} Update: Latest Developments in ${category.title.toLowerCase()} Sector`,
      subTitle: 'Stay informed with the most recent updates',
      slug: `${category.slug}-update-${idx + 1}-${timestamp}-extra`,
      category: category._id,
      tags: [category.slug, 'update'],
      summary: `Latest news and updates from the ${category.title.toLowerCase()} sector covering important developments and trends.`,
          heroImage: `https://picsum.photos/seed/${articleIndex + idx + timestamp + 100}/1200/600`,
      body: `<p>This article provides the latest updates and information about ${category.title.toLowerCase()}.</p>`,
      status: 'published',
      language,
      author: idx % 2 === 0 ? reporter._id : editor._id,
      editor: editor._id,
      stats: { views: 5000 - (idx * 200), readTime: 3, shares: 100 },
      flags: { isBreaking, isTopHeadline },
      publishedAt: new Date(Date.now() - ((articleIndex + idx) * 1_200_000))
    };
  });
  
  const allArticles = [...sampleArticles, ...extraArticles];

  await ArticleModel.insertMany(allArticles);
  console.log(`✅ Created ${allArticles.length} articles across ${categories.length} categories`);

  await LiveBlogModel.create({
    slug: 'election-results-live',
    title: 'Election Results 2025 Live Updates',
    summary: 'Minute-by-minute updates as counting concludes across key battleground states.',
    entries: [
      {
        timestamp: new Date(),
        content: '<p>Breaking: Lead consolidates in northern belt as early trends favor incumbent coalition.</p>',
        author: reporter._id
      },
      {
        timestamp: new Date(Date.now() - 1800_000),
        content: '<p>High turnout reported from urban pockets; EC briefing expected shortly.</p>',
        author: reporter._id
      }
    ]
  });

  await CalendarEventModel.insertMany([
    {
      title: 'Republic Day Parade Coverage',
      description: 'Flag-hoisting, parade, and president speech live blog.',
      date: new Date(Date.UTC(2026, 0, 26, 3, 30)),
      category: 'national',
      location: 'New Delhi',
      tags: ['holiday', 'parade'],
      createdBy: editor._id
    },
    {
      title: 'Union Budget 2026 Lock-in',
      description: 'Budget speech, market reaction, expert panel.',
      date: new Date(Date.UTC(2026, 1, 28, 5, 30)),
      category: 'business',
      location: 'Parliament',
      tags: ['budget', 'economy'],
      createdBy: editor._id
    },
    {
      title: 'T20 World Cup Final',
      description: 'Live scorecard, photo desk coordination.',
      date: new Date(Date.UTC(2026, 5, 14, 14, 0)),
      category: 'sports',
      location: 'Mumbai',
      tags: ['cricket'],
      createdBy: reporter._id
    }
  ]);

  console.log('Seed data created');
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});


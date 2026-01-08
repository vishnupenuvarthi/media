import mongoose from 'mongoose';
import { connectDb } from '../config/db.js';
import { ArticleModel } from '../models/article.model.js';
import { CategoryModel } from '../models/category.model.js';
import { UserModel } from '../models/user.model.js';
import { nanoid } from 'nanoid';

const createSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') + '-' + nanoid(6);
};

const run = async () => {
  await connectDb();

  // Get or create default category
  let category = await CategoryModel.findOne({ slug: 'nellore-english' });
  if (!category) {
    category = await CategoryModel.findOne({ slug: 'national' });
    if (!category) {
      category = await CategoryModel.create({
        title: 'Nellore News',
        slug: 'nellore-english',
        description: 'Latest news from Nellore, Andhra Pradesh'
      });
    }
  }

  // Get or create system user
  let user = await UserModel.findOne({ email: 'system@newsroom.local' }).catch(() => null);
  if (!user) {
    user = await UserModel.findOne({}).limit(1);
    if (!user) {
      console.log('No users found. Creating system user...');
      const bcrypt = await import('bcryptjs');
      const passwordHash = await bcrypt.default.hash('system-' + Date.now(), 10);
      user = await UserModel.create({
        email: 'system@newsroom.local',
        passwordHash: passwordHash,
        profile: { name: 'News Aggregator' },
        role: 'user',
        status: 'active'
      }).catch(() => {
        // If creation fails, find any existing user
        return UserModel.findOne({}).limit(1);
      });
    }
  }

  if (!user) {
    console.error('Could not create or find a user. Please run seed script first.');
    process.exit(1);
  }

  // Sample news articles about Nellore
  const sampleArticles = [
    {
      title: 'నెల్లూరులో కొత్త రోడ్డు నిర్మాణం ప్రారంభం',
      language: 'te',
      summary: 'నెల్లూరు నగరంలో కొత్త రోడ్డు నిర్మాణం ఈ రోజు ప్రారంభమైంది. ఈ ప్రాజెక్ట్ ప్రభుత్వం చేపట్టింది.',
      body: 'నెల్లూరు నగరంలో కొత్త రోడ్డు నిర్మాణం ఈ రోజు ప్రారంభమైంది. ఈ ప్రాజెక్ట్ ప్రభుత్వం చేపట్టింది. ఇది నగరంలో రవాణా సౌకర్యాలను మెరుగుపరుస్తుంది.',
      heroImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80',
      status: 'published',
      isAggregated: true,
      source: 'rss',
      sourceName: 'Sample News',
      location: { city: 'Nellore', state: 'Andhra Pradesh', country: 'India' },
      flags: { isBreaking: true, isTopHeadline: true }
    },
    {
      title: 'Nellore District Development Projects Announced',
      language: 'en',
      summary: 'New development projects worth crores announced for Nellore district by the state government.',
      body: 'The state government today announced several new development projects for Nellore district. These projects will significantly improve infrastructure and quality of life for residents.',
      heroImage: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80',
      status: 'published',
      isAggregated: true,
      source: 'rss',
      sourceName: 'Sample News',
      location: { city: 'Nellore', state: 'Andhra Pradesh', country: 'India' },
      flags: { isBreaking: true, isTopHeadline: true }
    },
    {
      title: 'నెల్లూరులో విద్యార్థుల సమ్మెలు',
      language: 'te',
      summary: 'నెల్లూరు విశ్వవిద్యాలయ విద్యార్థులు ఈ రోజు సమ్మెలు నిర్వహించారు.',
      body: 'నెల్లూరు విశ్వవిద్యాలయ విద్యార్థులు ఈ రోజు సమ్మెలు నిర్వహించారు. వారు అనేక వాదనలను పెంచారు.',
      heroImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      status: 'published',
      isAggregated: true,
      source: 'rss',
      location: { city: 'Nellore', state: 'Andhra Pradesh', country: 'India' },
      flags: { isBreaking: true }
    },
    {
      title: 'Nellore Beach Tourism Promotion Initiative',
      language: 'en',
      summary: 'Government launches new initiative to promote beach tourism in Nellore district.',
      body: 'The tourism department has launched a new initiative to promote beach tourism in Nellore district. This will boost local economy and create employment opportunities.',
      heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      status: 'published',
      isAggregated: true,
      source: 'rss',
      location: { city: 'Nellore', state: 'Andhra Pradesh', country: 'India' }
    },
    {
      title: 'నెల్లూరులో ఎగ్జిబిషన్ ప్రారంభం',
      language: 'te',
      summary: 'నెల్లూరు లో బృహత్ ప్రదర్శన ఈ రోజు ప్రారంభమైంది.',
      body: 'నెల్లూరు లో బృహత్ ప్రదర్శన ఈ రోజు ప్రారంభమైంది. వేలాది మంది ప్రజలు ఈ కార్యక్రమాన్ని వీక్షించారు.',
      heroImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
      status: 'published',
      isAggregated: true,
      source: 'rss',
      location: { city: 'Nellore', state: 'Andhra Pradesh', country: 'India' }
    }
  ];

  let created = 0;
  let skipped = 0;

  for (const articleData of sampleArticles) {
    try {
      // Check if similar article exists
      const existing = await ArticleModel.findOne({ 
        title: articleData.title,
        language: articleData.language
      });
      
      if (existing) {
        skipped++;
        continue;
      }

      const article = await ArticleModel.create({
        ...articleData,
        slug: createSlug(articleData.title),
        category: category._id,
        author: user._id,
        publishedAt: new Date(),
        tags: ['Nellore', 'Andhra Pradesh', articleData.language === 'te' ? 'తెలుగు' : 'English'],
        stats: { views: Math.floor(Math.random() * 1000), readTime: 5 }
      });

      created++;
      console.log(`✅ Created: ${article.title.substring(0, 50)}...`);
    } catch (error) {
      console.error(`❌ Error creating article:`, error.message);
      skipped++;
    }
  }

  console.log(`\n✅ Created ${created} articles, skipped ${skipped}`);
  await mongoose.connection.close();
  process.exit(0);
};

run().catch(console.error);




import mongoose from 'mongoose';
import { connectDb } from '../config/db.js';
import { CategoryModel } from '../models/category.model.js';
import { ArticleModel } from '../models/article.model.js';
import { LiveBlogModel } from '../models/liveBlog.model.js';
import { UserModel } from '../models/user.model.js';
const run = async () => {
    await connectDb();
    await Promise.all([CategoryModel.deleteMany({}), ArticleModel.deleteMany({}), LiveBlogModel.deleteMany({}), UserModel.deleteMany({})]);
    const [politics, business, sports, tech] = await CategoryModel.insertMany([
        { title: 'Politics', slug: 'politics', description: 'National, policy and parliament updates.' },
        { title: 'Business', slug: 'business', description: 'Markets, startups and economy.' },
        { title: 'Sports', slug: 'sports', description: 'Cricket, football, Olympics.' },
        { title: 'Technology', slug: 'technology', description: 'Startups, policy, innovation.' }
    ]);
    const [reporter, editor] = await UserModel.insertMany([
        { email: 'reporter@bharatbulletin.com', passwordHash: 'hashed', role: 'reporter', profile: { name: 'Anita Rao' } },
        { email: 'editor@bharatbulletin.com', passwordHash: 'hashed', role: 'editor', profile: { name: 'Vikram Patel' } }
    ]);
    const sampleArticles = [...Array(10)].map((_, idx) => ({
        title: `Major development headline ${idx + 1}`,
        subTitle: 'Detailed subheading for better context',
        slug: `major-development-${idx + 1}`,
        category: [politics, business, sports, tech][idx % 4]._id,
        tags: ['india', 'breaking', 'analysis'].slice(0, (idx % 3) + 1),
        summary: 'Summary of the article covering the most important facts readers need quickly.',
        heroImage: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=60',
        body: `<p>Paragraph ${idx + 1} of detailed reporting with <strong>context</strong>, quotes and multimedia embeds.</p>`,
        status: 'published',
        author: reporter._id,
        editor: editor._id,
        stats: { views: 5000 - idx * 300, readTime: 6, shares: 200 - idx * 10 },
        flags: { isBreaking: idx < 3, isTopHeadline: idx < 5 },
        publishedAt: new Date(Date.now() - idx * 3600000)
    }));
    await ArticleModel.insertMany(sampleArticles);
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
                timestamp: new Date(Date.now() - 1800000),
                content: '<p>High turnout reported from urban pockets; EC briefing expected shortly.</p>',
                author: reporter._id
            }
        ]
    });
    console.log('Seed data created');
    await mongoose.disconnect();
};
run().catch((err) => {
    console.error(err);
    process.exit(1);
});

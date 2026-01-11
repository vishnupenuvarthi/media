import { Schema, model } from 'mongoose';

const ArticleSchema = new Schema(
  {
    title: { type: String, required: true },
    subTitle: String,
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    tags: [{ type: String }],
    summary: String,
    heroImage: String,
    body: { type: String, required: true },
    status: {
      type: String,
      enum: ['draft', 'review', 'scheduled', 'published'],
      default: 'draft',
      index: true
    },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: function () { return !this.isAggregated; } },
    editor: { type: Schema.Types.ObjectId, ref: 'User' },
    stats: {
      views: { type: Number, default: 0 },
      readTime: { type: Number, default: 5 },
      shares: { type: Number, default: 0 }
    },
    flags: {
      isBreaking: { type: Boolean, default: false },
      isTopHeadline: { type: Boolean, default: false }
    },
    publishedAt: { type: Date, index: true },
    scheduledAt: Date,
    // New fields for dynamic news aggregation
    language: {
      type: String,
      enum: ['en', 'te'],
      default: 'en',
      index: true
    },
    source: {
      type: String,
      enum: ['manual', 'rss', 'newsapi', 'scraper'],
      default: 'manual'
    },
    sourceUrl: String,
    sourceName: String,
    location: {
      city: String,
      state: String,
      country: { type: String, default: 'India' }
    },
    isAggregated: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const ArticleModel = model('Article', ArticleSchema);


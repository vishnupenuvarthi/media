import { Schema, model, Types } from 'mongoose';
const ArticleSchema = new Schema({
    title: { type: String, required: true },
    subTitle: String,
    slug: { type: String, required: true, unique: true, index: true },
    summary: String,
    body: { type: String, required: true },
    heroImage: String,
    category: { type: Types.ObjectId, ref: 'Category', required: true },
    tags: [{ type: String }],
    author: { type: Types.ObjectId, ref: 'User', required: true },
    editor: { type: Types.ObjectId, ref: 'User' },
    status: {
        type: String,
        enum: ['draft', 'review', 'scheduled', 'published', 'archived'],
        default: 'draft',
        index: true
    },
    isBreaking: { type: Boolean, default: false },
    isTopHeadline: { type: Boolean, default: false },
    isSponsored: { type: Boolean, default: false },
    stats: {
        views: { type: Number, default: 0 },
        readTime: { type: Number, default: 5 }
    },
    publishedAt: Date,
    scheduledAt: Date
}, { timestamps: true });
export const ArticleModel = model('Article', ArticleSchema);

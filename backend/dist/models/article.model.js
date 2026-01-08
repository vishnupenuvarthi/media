import { Schema, model } from 'mongoose';
const ArticleSchema = new Schema({
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
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
    publishedAt: Date,
    scheduledAt: Date
}, { timestamps: true });
export const ArticleModel = model('Article', ArticleSchema);

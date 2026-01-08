import { Schema, model } from 'mongoose';
const LiveEntrySchema = new Schema({
    timestamp: { type: Date, default: Date.now },
    content: { type: String, required: true },
    mediaUrl: String,
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: false });
const LiveBlogSchema = new Schema({
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    status: { type: String, enum: ['live', 'archived'], default: 'live' },
    entries: [LiveEntrySchema]
}, { timestamps: true });
export const LiveBlogModel = model('LiveBlog', LiveBlogSchema);

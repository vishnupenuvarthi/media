import { Schema, model, Types } from 'mongoose';
const LiveEntrySchema = new Schema({
    timestamp: { type: Date, default: Date.now },
    content: { type: String, required: true },
    mediaUrl: String,
    author: { type: Types.ObjectId, ref: 'User' }
}, { _id: true });
const LiveBlogSchema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: String,
    status: { type: String, enum: ['live', 'archived'], default: 'live' },
    entries: [LiveEntrySchema]
}, { timestamps: true });
export const LiveBlogModel = model('LiveBlog', LiveBlogSchema);

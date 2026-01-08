import { ArticleModel } from '../models/Article.js';
export const getNewsroomDashboard = async () => {
    const [drafts, review, scheduled, publishedToday] = await Promise.all([
        ArticleModel.countDocuments({ status: 'draft' }),
        ArticleModel.countDocuments({ status: 'review' }),
        ArticleModel.countDocuments({ status: 'scheduled' }),
        ArticleModel.countDocuments({
            status: 'published',
            publishedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        })
    ]);
    const queue = await ArticleModel.find({ status: { $in: ['review', 'scheduled'] } })
        .sort({ updatedAt: -1 })
        .limit(5)
        .populate('author')
        .lean();
    return {
        stats: { drafts, inReview: review, scheduled, publishedToday },
        queue: queue.map((doc) => ({
            id: doc._id.toString(),
            title: doc.title,
            author: doc.author?.name ?? 'Unknown',
            status: doc.status,
            updatedAt: doc.updatedAt
        }))
    };
};

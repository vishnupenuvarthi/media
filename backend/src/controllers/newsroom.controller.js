import { ArticleModel } from '../models/article.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboard = asyncHandler(async (_req, res) => {
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
    .limit(8)
    .select('title status updatedAt')
    .populate('author', 'profile.name')
    .lean();

  res.json({
    stats: { drafts, inReview: review, scheduled, publishedToday },
    queue: queue.map((item) => ({
      id: item._id.toString(),
      title: item.title,
      status: item.status,
      updatedAt: item.updatedAt,
      author: item.author?.profile?.name ?? 'Staff'
    }))
  });
});

import { ArticleModel } from '../models/article.model.js';
export const ArticleService = {
    listHero: () => ArticleModel.find({ status: 'published' })
        .sort({ 'flags.isTopHeadline': -1, publishedAt: -1 })
        .limit(4)
        .populate('author', 'profile.name')
        .populate('category', 'title')
        .lean(),
    listBreaking: () => ArticleModel.find({ status: 'published', 'flags.isBreaking': true })
        .sort({ updatedAt: -1 })
        .limit(10)
        .select('title slug publishedAt category')
        .populate('category', 'title slug')
        .lean(),
    listLatest: () => ArticleModel.find({ status: 'published' })
        .sort({ publishedAt: -1 })
        .limit(12)
        .select('title slug publishedAt category')
        .populate('category', 'title slug')
        .lean(),
    listTrending: () => ArticleModel.find({ status: 'published' })
        .sort({ 'stats.views': -1 })
        .limit(5)
        .select('title slug category publishedAt')
        .populate('category', 'title slug')
        .lean(),
    getBySlug: (slug) => ArticleModel.findOne({ slug, status: 'published' })
        .populate('author', 'profile.name profile.bio')
        .populate('category', 'title slug')
        .lean(),
    listByCategory: (categoryId) => ArticleModel.find({ status: 'published', category: categoryId })
        .sort({ publishedAt: -1 })
        .lean()
};

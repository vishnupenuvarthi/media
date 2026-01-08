import { ArticleService } from '../services/article.service.js';
import { ApiError } from '../middleware/errorHandler.js';
export const listArticles = async (req, res) => {
    if (req.query.flag === 'breaking') {
        const breaking = await ArticleService.listBreaking();
        return res.json(breaking.map((item) => ({
            id: item._id.toString(),
            title: item.title,
            slug: item.slug,
            category: item.category?.title ?? 'News',
            publishedAt: item.publishedAt ?? item.updatedAt
        })));
    }
    const latest = await ArticleService.listLatest();
    res.json(latest);
};
export const getArticle = async (req, res) => {
    const article = await ArticleService.getBySlug(req.params.slug);
    if (!article) {
        throw new ApiError(404, 'Article not found');
    }
    res.json({
        id: article._id.toString(),
        title: article.title,
        subtitle: article.subTitle,
        slug: article.slug,
        summary: article.summary,
        body: article.body,
        heroImage: article.heroImage,
        category: article.category?.title ?? 'News',
        tags: article.tags,
        author: {
            name: article.author?.profile?.name ?? 'Staff',
            bio: article.author?.profile?.bio
        },
        stats: article.stats,
        publishedAt: article.publishedAt ?? article.updatedAt,
        updatedAt: article.updatedAt,
        related: []
    });
};

import { ArticleService } from '../services/article.service.js';
import { ApiError } from '../middleware/errorHandler.js';
import { isDbConnected } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listArticles = asyncHandler(async (req, res) => {
  try {
    // Check if database is connected
    if (!isDbConnected()) {
      console.warn('⚠️  Database not connected - returning empty articles list');
      return res.json([]);
    }

    // Get language from query, default to Telugu
    const language = req.query.lang === 'en' ? 'en' : 'te';
    
    if (req.query.flag === 'breaking') {
      const breaking = await ArticleService.listBreaking(language).catch(() => []);
      return res.json(
        (breaking || []).map((item) => ({
          id: item._id.toString(),
          title: item.title,
          slug: item.slug,
          category: item.category?.title ?? 'News',
          publishedAt: item.publishedAt ?? item.updatedAt,
          language: item.language || language,
          heroImage: item.heroImage,
          summary: item.summary
        }))
      );
    }
    const latest = await ArticleService.listLatest(language).catch(() => []);
    res.json((latest || []).map(item => ({
      ...item,
      id: item._id.toString(),
      category: item.category?.title ?? 'News'
    })));
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.json([]);
  }
});

export const getArticle = asyncHandler(async (req, res) => {
  try {
    if (!isDbConnected()) {
      throw new ApiError(503, 'Database not connected. Please try again later.');
    }

    const article = await ArticleService.getBySlug(req.params.slug).catch(() => null);
    if (!article) {
      throw new ApiError(404, 'Article not found');
    }

    const doc = article;
    
    // Get related articles from same category
    const related = await ArticleService.listByCategory(doc.category?._id || doc.category).catch(() => []);
    const relatedFormatted = (related || [])
      .filter((item) => item._id.toString() !== doc._id.toString())
      .slice(0, 4)
      .map((item) => ({
        id: item._id.toString(),
        title: item.title,
        slug: item.slug,
        category: item.category?.title ?? 'News',
        publishedAt: item.publishedAt ?? item.updatedAt
      }));

    res.json({
      id: doc._id.toString(),
      title: doc.title,
      subtitle: doc.subTitle,
      slug: doc.slug,
      summary: doc.summary,
      body: doc.body,
      heroImage: doc.heroImage,
      category: doc.category?.title ?? 'News',
      tags: doc.tags || [],
      author: {
        name: doc.author?.profile?.name ?? 'Staff',
        bio: doc.author?.profile?.bio
      },
      stats: doc.stats || { views: 0, readTime: 5 },
      publishedAt: doc.publishedAt ?? doc.updatedAt,
      updatedAt: doc.updatedAt,
      related: relatedFormatted
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Error fetching article:', error);
    throw new ApiError(500, 'Failed to fetch article');
  }
});

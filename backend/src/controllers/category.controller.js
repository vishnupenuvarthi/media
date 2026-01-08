import { CategoryService } from '../services/category.service.js';
import { ArticleService } from '../services/article.service.js';
import { isDbConnected } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getCategory = asyncHandler(async (req, res) => {
  try {
    // Check database connection
    if (!isDbConnected()) {
      return res.status(503).json({
        message: 'Database connection is not available. Please try again in a moment.'
      });
    }

    const language = req.query.lang === 'en' ? 'en' : 'te';
    const category = await CategoryService.getBySlug(req.params.slug).catch(() => null);
    
    if (!category) {
      return res.status(404).json({
        message: 'Category not found',
        category: null,
        featured: null,
        latest: [],
        relatedTags: []
      });
    }

    const stories = await ArticleService.listByCategory(category._id, language).catch(() => []);
    
    if (!stories || stories.length === 0) {
      return res.json({
        category: {
          id: category._id.toString(),
          title: category.title,
          slug: category.slug,
          description: category.description,
          heroImage: category.heroImage
        },
        featured: null,
        latest: [],
        relatedTags: []
      });
    }
    
    const formatStory = (story) => ({
      id: story._id.toString(),
      title: story.title,
      slug: story.slug,
      category: category.title,
      subtitle: story.subTitle,
      heroImage: story.heroImage,
      summary: story.summary,
      publishedAt: story.publishedAt || story.updatedAt
    });
    
    res.json({
      category: {
        id: category._id.toString(),
        title: category.title,
        slug: category.slug,
        description: category.description,
        heroImage: category.heroImage
      },
      featured: stories[0] ? formatStory(stories[0]) : null,
      latest: stories.slice(1).map(formatStory),
      relatedTags: Array.from(new Set(stories.flatMap((story) => story.tags || []))).slice(0, 10)
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      message: 'Error fetching category data',
      category: null,
      featured: null,
      latest: [],
      relatedTags: []
    });
  }
});


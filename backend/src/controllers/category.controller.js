import { CategoryService } from '../services/category.service.js';
import { ArticleService } from '../services/article.service.js';
import { isDbConnected } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ArticleModel } from '../models/article.model.js';

// Tag-based category mapping
const TAG_CATEGORIES = {
  cities: ['cities', 'city', 'urban', 'municipal'],
  budget: ['budget', 'budget2025', 'union-budget', 'finance'],
  elections: ['elections', 'election', 'politics', 'voting'],
  podcasts: ['podcasts', 'podcast', 'audio'],
  explainers: ['explainers', 'explainer', 'analysis'],
  photos: ['photos', 'photo', 'photography', 'images'],
  videos: ['videos', 'video', 'youtube']
};

export const getCategoryByTag = asyncHandler(async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({
        message: 'Database connection is not available. Please try again in a moment.'
      });
    }

    const { tag } = req.params;
    const language = req.query.lang === 'en' ? 'en' : 'te';
    
    const tagList = TAG_CATEGORIES[tag] || [tag];
    
    // Build query for articles with matching tags
    const query = {
      status: 'published',
      tags: { $in: tagList },
      $or: [
        { 'flags.isBreaking': { $ne: true } },
        { 'flags.isBreaking': { $exists: false } },
        { 'flags': { $exists: false } }
      ]
    };
    
    // Language filtering
    if (language === 'te') {
      query.language = 'te';
    } else {
      query.$and = [
        {
          $or: [
            { 'flags.isBreaking': { $ne: true } },
            { 'flags.isBreaking': { $exists: false } },
            { 'flags': { $exists: false } }
          ]
        },
        {
          $or: [
            { language: 'en' },
            { language: { $exists: false } },
            { language: null }
          ]
        }
      ];
      delete query.$or;
    }
    
    const stories = await ArticleModel.find(query)
      .sort({ publishedAt: -1 })
      .limit(50)
      .populate('category', 'title slug')
      .select('title slug publishedAt category language summary heroImage subTitle tags flags')
      .lean();
    
    const filteredStories = stories.filter(a => !(a.flags && a.flags.isBreaking === true));
    
    if (!filteredStories || filteredStories.length === 0) {
      return res.json({
        category: {
          id: tag,
          title: tag.charAt(0).toUpperCase() + tag.slice(1),
          slug: tag,
          description: `Articles tagged with ${tag}`
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
      category: story.category?.title ?? 'News',
      subtitle: story.subTitle,
      heroImage: story.heroImage,
      summary: story.summary,
      publishedAt: story.publishedAt || story.updatedAt
    });
    
    res.json({
      category: {
        id: tag,
        title: tag.charAt(0).toUpperCase() + tag.slice(1).replace(/([A-Z])/g, ' $1'),
        slug: tag,
        description: `Latest articles about ${tag}`
      },
      featured: filteredStories[0] ? formatStory(filteredStories[0]) : null,
      latest: filteredStories.slice(1).map(formatStory),
      relatedTags: Array.from(new Set(filteredStories.flatMap((story) => story.tags || []))).slice(0, 10)
    });
  } catch (error) {
    console.error('Error fetching tag category:', error);
    res.status(500).json({
      message: 'Error fetching category data',
      category: null,
      featured: null,
      latest: [],
      relatedTags: []
    });
  }
});

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


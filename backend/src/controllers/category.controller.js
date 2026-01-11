import { CategoryService } from '../services/category.service.js';
import { ArticleService } from '../services/article.service.js';
import { CalendarService } from '../services/calendar.service.js';
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

    const { slug } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    // Handle calendar as a special category
    if (slug === 'calendar') {
      const now = new Date();
      const events = await CalendarService.listEvents({
        year: now.getUTCFullYear(),
        month: now.getUTCMonth() + 1
      });

      return res.json({
        category: {
          id: 'calendar',
          title: 'NLR News Calendar',
          slug: 'calendar',
          description: 'Important dates, events, and deadlines'
        },
        featured: null,
        latest: events.map((event) => ({
          id: event._id.toString(),
          title: event.title,
          slug: 'calendar',
          category: 'Calendar',
          subtitle: event.category,
          summary: event.description,
          publishedAt: event.date
        })),
        relatedTags: []
      });
    }

    const language = req.query.lang === 'en' ? 'en' : 'te';
    const category = await CategoryService.getBySlug(slug).catch(() => null);

    if (!category) {
      return res.status(404).json({
        message: 'Category not found',
        category: null,
        featured: null,
        latest: [],
        relatedTags: []
      });
    }

    const stories = await ArticleService.listByCategory(category._id, language, page, limit).catch(() => []);

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
        relatedTags: [],
        pagination: {
          page,
          limit,
          hasMore: false
        }
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

    // For the first page, we might want to pick a featured story
    // But to simplify pagination, we won't special-case 'featured' in the paginated response structure as strictly
    // Or we just treat index 0 as featured only on page 1.

    let featured = null;
    let latestStories = stories;

    if (page === 1 && stories.length > 0) {
      featured = formatStory(stories[0]);
      latestStories = stories.slice(1);
    } else {
      latestStories = stories;
    }

    res.json({
      category: {
        id: category._id.toString(),
        title: category.title,
        slug: category.slug,
        description: category.description,
        heroImage: category.heroImage
      },
      featured: featured, // Null on page > 1
      latest: latestStories.map(formatStory),
      relatedTags: page === 1 ? Array.from(new Set(stories.flatMap((story) => story.tags || []))).slice(0, 10) : [],
      pagination: {
        page,
        limit,
        hasMore: stories.length === limit // Rough estimate, technically needs separate count but good enough for load more
      }
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

export const getAllCategories = asyncHandler(async (req, res) => {
  try {
    // Check database connection
    if (!isDbConnected()) {
      return res.status(503).json({
        message: 'Database connection is not available. Please try again in a moment.'
      });
    }

    const categories = await CategoryService.listAll().catch(() => []);

    if (!categories || categories.length === 0) {
      // Include Calendar as default category even if no other categories exist
      return res.json({
        categories: [
          {
            id: 'calendar',
            title: 'NLR News Calendar',
            slug: 'calendar',
            description: 'Important dates, events, and deadlines',
            isDefault: true
          }
        ]
      });
    }

    // Add Calendar as a default category at the beginning
    const allCategories = [
      {
        id: 'calendar',
        title: 'NLR News Calendar',
        slug: 'calendar',
        description: 'Important dates, events, and deadlines',
        isDefault: true
      },
      ...categories.map((cat) => ({
        id: cat._id.toString(),
        title: cat.title,
        slug: cat.slug,
        description: cat.description,
        isDefault: false
      }))
    ];

    res.json({ categories: allCategories });
  } catch (error) {
    console.error('Error fetching all categories:', error);
    res.status(500).json({
      message: 'Error fetching categories',
      categories: [
        {
          id: 'calendar',
          title: 'NLR News Calendar',
          slug: 'calendar',
          description: 'Important dates, events, and deadlines',
          isDefault: true
        }
      ]
    });
  }
});

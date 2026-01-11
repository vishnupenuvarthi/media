import { ArticleModel } from '../models/article.model.js';

export const ArticleService = {
  listHero: async (language = 'te') => {
    try {
      // Show all published articles, prioritize top headlines
      // EXCLUDE breaking news from hero section
      // STRICT language filtering for Telugu
      const query = {
        status: 'published',
        $or: [
          { 'flags.isBreaking': { $ne: true } },
          { 'flags.isBreaking': { $exists: false } },
          { 'flags': { $exists: false } }
        ]
      };

      // For Telugu, only show Telugu articles (strict)
      if (language === 'te') {
        query.language = 'te';
      } else {
        // For English, show English or universal
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

      const articles = await ArticleModel.find(query)
        .sort({
          'flags.isTopHeadline': -1,
          publishedAt: -1
        })
        .limit(20)
        .select('title slug publishedAt category language summary heroImage subTitle tags flags')
        .populate('author', 'profile.name')
        .populate('category', 'title slug')
        .lean();

      // Double-check: Filter out breaking news
      const nonBreaking = articles.filter(a => !(a.flags && a.flags.isBreaking === true));

      return nonBreaking.slice(0, 8);
    } catch (error) {
      console.error('Error in listHero:', error.message);
      return [];
    }
  },

  listBreaking: (language = 'te') => {
    // Show breaking news - STRICT language filtering for Telugu
    const query = {
      status: 'published',
      'flags.isBreaking': true
    };

    // For Telugu, only show Telugu articles (strict)
    if (language === 'te') {
      query.language = 'te';
    } else {
      // For English, show English or universal
      query.$or = [
        { language: 'en' },
        { language: { $exists: false } },
        { language: null }
      ];
    }

    return ArticleModel.find(query)
      .sort({
        publishedAt: -1
      })
      .limit(20)
      .select('title slug publishedAt category language heroImage summary')
      .populate('category', 'title slug')
      .lean();
  },

  listLatest: async (language = 'te') => {
    try {
      // STRICT language filtering - for Telugu, only show Telugu articles
      // EXCLUDE breaking news from latest section - use $and to ensure breaking news is excluded
      const baseQuery = {
        status: 'published',
        $and: [
          {
            $or: [
              { 'flags.isBreaking': { $ne: true } },
              { 'flags.isBreaking': { $exists: false } },
              { 'flags': { $exists: false } }
            ]
          }
        ]
      };

      // For Telugu, only show Telugu articles (strict)
      if (language === 'te') {
        baseQuery.language = 'te';
      } else {
        // For English, show English or universal - add to $and array
        baseQuery.$and.push({
          $or: [
            { language: 'en' },
            { language: { $exists: false } },
            { language: null }
          ]
        });
      }

      // Get all articles matching language (excluding breaking news)
      const allArticles = await ArticleModel.find(baseQuery)
        .sort({ publishedAt: -1 })
        .limit(50)
        .select('title slug publishedAt category language summary heroImage subTitle tags location isAggregated flags')
        .populate('category', 'title slug')
        .lean();

      // Double-check: Filter out any breaking news articles that might have slipped through
      const nonBreakingArticles = allArticles.filter(a => {
        return !(a.flags && a.flags.isBreaking === true);
      });

      // Prioritize Nellore/Andhra Pradesh articles
      const nelloreKeywords = ['Nellore', 'nellore', 'Andhra Pradesh', 'andhra pradesh', 'నెల్లూరు', 'ఆంధ్రప్రదేశ్', 'AP', 'ap'];
      const nelloreArticles = nonBreakingArticles.filter(a =>
        a.location?.city === 'Nellore' ||
        a.location?.state === 'Andhra Pradesh' ||
        (a.tags || []).some(tag => nelloreKeywords.includes(tag)) ||
        a.isAggregated === true
      );

      const otherArticles = nonBreakingArticles.filter(a => !nelloreArticles.includes(a));

      // Return Nellore/AP articles first, then others (all non-breaking)
      return [...nelloreArticles, ...otherArticles].slice(0, 20);
    } catch (error) {
      console.error('Error in listLatest:', error.message);
      return [];
    }
  },

  listTrending: async (language = 'te') => {
    try {
      // Show trending articles - STRICT language filtering
      // EXCLUDE breaking news from trending section
      const query = {
        status: 'published',
        $or: [
          { 'flags.isBreaking': { $ne: true } },
          { 'flags.isBreaking': { $exists: false } },
          { 'flags': { $exists: false } }
        ]
      };

      // For Telugu, only show Telugu articles (strict)
      if (language === 'te') {
        query.language = 'te';
      } else {
        // For English, show English or universal
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

      const articles = await ArticleModel.find(query)
        .sort({
          'stats.views': -1,
          publishedAt: -1
        })
        .limit(20)
        .select('title slug category publishedAt language heroImage summary flags')
        .populate('category', 'title slug')
        .lean();

      // Double-check: Filter out breaking news
      const nonBreaking = articles.filter(a => !(a.flags && a.flags.isBreaking === true));

      return nonBreaking.slice(0, 10);
    } catch (error) {
      console.error('Error in listTrending:', error.message);
      return [];
    }
  },

  getBySlug: (slug) =>
    ArticleModel.findOne({ slug, status: 'published' })
      .populate('author', 'profile.name profile.bio')
      .populate('category', 'title slug')
      .lean(),

  listByCategory: async (categoryId, language = 'te', page = 1, limit = 20) => {
    // EXCLUDE breaking news from category pages
    const query = {
      status: 'published',
      category: categoryId,
      $or: [
        { 'flags.isBreaking': { $ne: true } },
        { 'flags.isBreaking': { $exists: false } },
        { 'flags': { $exists: false } }
      ]
    };

    // For Telugu, only show Telugu articles (strict)
    if (language === 'te') {
      query.language = 'te';
    } else {
      // For English, show English or universal
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

    const skip = (page - 1) * limit;

    const articles = await ArticleModel.find(query)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('category', 'title slug')
      .select('title slug publishedAt category language summary heroImage subTitle tags flags')
      .lean();

    // Double-check: Filter out breaking news (though query handles it)
    return articles.filter(a => !(a.flags && a.flags.isBreaking === true));
  },

  /**
   * Fetch articles for a given category slug
   * @param {string} slug - category slug (e.g., 'india', 'business')
   * @param {string} language - 'te' or 'en'
   * @param {number} page - page number
   * @param {number} limit - max items to return
   */
  listByCategorySlug: async (slug, language = 'te', page = 1, limit = 20) => {
    try {
      // First get the category
      const CategoryModel = (await import('../models/category.model.js')).CategoryModel;
      const category = await CategoryModel.findOne({ slug }).lean();

      if (!category) {
        console.warn(`Category not found: ${slug}`);
        return [];
      }

      // Then find articles for that category - STRICT language filtering
      // EXCLUDE breaking news from category sections
      const query = {
        status: 'published',
        category: category._id,
        $or: [
          { 'flags.isBreaking': { $ne: true } },
          { 'flags.isBreaking': { $exists: false } },
          { 'flags': { $exists: false } }
        ]
      };

      // For Telugu, only show Telugu articles (strict)
      if (language === 'te') {
        query.language = 'te';
      } else {
        // For English, show English or universal
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

      const skip = (page - 1) * limit;

      const articles = await ArticleModel.find(query)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('title slug publishedAt category language summary heroImage subTitle tags flags')
        .populate('category', 'title slug')
        .lean();

      // Double-check: Filter out breaking news
      const nonBreaking = articles.filter(a => !(a.flags && a.flags.isBreaking === true));

      console.log(`Found ${nonBreaking.length} articles for category ${slug} (page ${page}, lang: ${language})`);
      return nonBreaking;
    } catch (error) {
      console.error(`Error in listByCategorySlug for ${slug}:`, error.message);
      return [];
    }
  },

  // Get Nellore-specific news
  listNelloreNews: (language = 'te', limit = 20) => {
    const query = {
      status: 'published',
      $or: [
        { 'location.city': 'Nellore' },
        { isAggregated: true }
      ],
      $and: [
        {
          $or: [
            { language: language },
            { language: { $exists: false } }
          ]
        }
      ]
    };
    return ArticleModel.find(query)
      .sort({ publishedAt: -1 })
      .limit(limit)
      .select('title slug publishedAt category language summary heroImage')
      .populate('category', 'title slug')
      .lean();
  }
};

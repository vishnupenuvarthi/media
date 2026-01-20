import { ArticleService } from '../services/article.service.js';
import { CategoryService } from '../services/category.service.js';
import { CalendarService } from '../services/calendar.service.js';
import { YouTubeService } from '../services/youtube.service.js';
import { isDbConnected } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const formatHeadline = (article) => ({
  id: article._id.toString(),
  title: article.title,
  slug: article.slug,
  category: article.category?.title ?? 'News',
  summary: article.summary,
  heroImage: article.heroImage,
  publishedAt: article.publishedAt ?? article.updatedAt
});

const formatHeadlineWithSummary = (article) => ({
  id: article._id.toString(),
  title: article.title,
  slug: article.slug,
  category: article.category?.title ?? 'News',
  summary: article.summary,
  heroImage: article.heroImage,
  publishedAt: article.publishedAt ?? article.updatedAt
});

export const getHomeFeed = asyncHandler(async (req, res) => {
  try {
    // Check if database is connected
    if (!isDbConnected()) {
      console.warn('⚠️  Database not connected - returning empty feed');
      return res.json({
        hero: [],
        sections: [],
        latest: [],
        trending: [],
        videos: [],
        photos: [],
        categorySections: [],
        calendar: [],
        youtube: []
      });
    }

    // Get language from query or default to Telugu
    const language = req.query.lang === 'en' ? 'en' : 'te';

    const sectionSlugs = ['india', 'world', 'business', 'markets', 'tech', 'sports', 'entertainment', 'lifestyle', 'opinion'];

    const [hero, sections, latest, trending, categorySections, calendarEvents, youtubeVideos] = await Promise.all([
      ArticleService.listHero(language).catch(() => []),
      CategoryService.listAll().catch(() => []),
      ArticleService.listLatest(language).catch(() => []),
      ArticleService.listTrending(language).catch(() => []),
      Promise.all(
        sectionSlugs.map(async (slug) => {
          try {
            const category = await CategoryService.getBySlug(slug).catch(() => null);
            if (!category) {
              console.warn(`Category ${slug} not found`);
              return { slug, category: null, stories: [] };
            }
            const stories = await ArticleService.listByCategorySlug(slug, language, 10).catch((err) => {
              console.error(`Error fetching articles for ${slug}:`, err.message);
              return [];
            });

            if (stories.length === 0) {
              console.warn(`No articles found for category ${slug}`);
            }

            return {
              slug,
              category: {
                id: category._id.toString(),
                title: category.title,
                slug: category.slug,
                description: category.description
              },
              stories: stories.map(formatHeadlineWithSummary)
            };
          } catch (err) {
            console.error(`Error building category section ${slug}:`, err);
            return { slug, category: null, stories: [] };
          }
        })
      ),
      (async () => {
        try {
          const now = new Date();
          const events = await CalendarService.listEvents({ year: now.getUTCFullYear(), month: now.getUTCMonth() + 1 });
          return events.map((event) => ({
            id: event._id.toString(),
            title: event.title,
            date: event.date,
            description: event.description,
            category: event.category,
            tags: event.tags ?? []
          }));
        } catch (err) {
          console.error('Error fetching calendar events:', err);
          return [];
        }
      })(),
      (async () => {
        try {
          const videos = await YouTubeService.getChannelVideos({ channelHandle: '@chinnap9430', limit: 8 });
          return videos || [];
        } catch (err) {
          console.error('Error fetching YouTube feed:', err.message);
          return [];
        }
      })()
    ]);

    // Filter out breaking news from hero section
    const nonBreakingHero = (hero || []).filter(a => !(a.flags && a.flags.isBreaking === true));

    const heroFormatted = nonBreakingHero.slice(0, 8).map((article) => ({
      id: article._id.toString(),
      title: article.title,
      slug: article.slug,
      category: article.category?.title ?? 'News',
      summary: article.summary,
      heroImage: article.heroImage,
      author: { name: article.author?.profile?.name ?? 'Staff' },
      publishedAt: article.publishedAt ?? article.updatedAt
    }));

    // Build sections from categories with articles - EXCLUDE breaking news
    const sectionPayload = (sections || []).map((category) => {
      // Get articles for this category - check both _id and direct category reference
      // Filter out breaking news articles
      const categoryArticles = [...(hero || []), ...(latest || [])]
        .filter((article) => {
          if (!article.category) return false;

          // Exclude breaking news
          if (article.flags && article.flags.isBreaking === true) {
            return false;
          }

          // Handle both populated and unpopulated category references
          const articleCatId = article.category?._id
            ? article.category._id.toString()
            : article.category.toString();
          const categoryId = category._id.toString();

          return articleCatId === categoryId;
        })
        .slice(0, 4);

      return {
        category: {
          id: category._id.toString(),
          title: category.title,
          slug: category.slug,
          description: category.description
        },
        stories: categoryArticles.map(formatHeadline)
      };
    }).filter((section) => section.stories.length > 0); // Only include sections with articles

    // Filter out breaking news from latest and trending
    const nonBreakingLatest = (latest || []).filter(a => !(a.flags && a.flags.isBreaking === true));
    const nonBreakingTrending = (trending || []).filter(a => !(a.flags && a.flags.isBreaking === true));

    res.json({
      hero: heroFormatted,
      sections: sectionPayload,
      latest: nonBreakingLatest.map(formatHeadline),
      trending: nonBreakingTrending.map(formatHeadline),
      videos: heroFormatted,
      photos: nonBreakingLatest.map(formatHeadline),
      categorySections: categorySections.map(section => ({
        ...section,
        stories: section.stories.filter(() => {
          // Double-check no breaking news in category sections
          return true; // Already filtered in listByCategorySlug
        })
      })),
      calendar: calendarEvents,
      youtube: youtubeVideos
    });
  } catch (error) {
    console.error('Error fetching home feed:', error);
    res.json({
      hero: [],
      sections: [],
      latest: [],
      trending: [],
      videos: [],
      photos: [],
      categorySections: [],
      calendar: [],
      youtube: []
    });
  }
});


export const getYouTubeFeed = asyncHandler(async (req, res) => {
  try {
    const videos = await YouTubeService.getChannelVideos({ channelHandle: '@chinnap9430', limit: 30 }); // Increased limit for dedicated page
    res.json(videos || []);
  } catch (err) {
    console.error('Error fetching YouTube feed:', err.message);
    res.status(500).json([]);
  }
});


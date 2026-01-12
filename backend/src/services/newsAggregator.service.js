import Parser from 'rss-parser';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { ArticleModel } from '../models/article.model.js';
import { CategoryModel } from '../models/category.model.js';
import { UserModel } from '../models/user.model.js';
import { nanoid } from 'nanoid';

const parser = new Parser({
  customFields: {
    item: ['media:content', 'description']
  }
});

// High-quality fallback images by category
const CATEGORY_FALLBACKS = {
  politics: 'https://images.unsplash.com/photo-1529107386303-06b6f2743259?w=1200&q=80',
  business: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
  sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&q=80',
  tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
  entertainment: 'https://images.unsplash.com/photo-1603190287605-e6ade32fa852?w=1200&q=80',
  world: 'https://images.unsplash.com/photo-1521295914104-cd53a998d892?w=1200&q=80',
  india: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=1200&q=80',
  nellore: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=1200&q=80', // General Andhra-style image
  default: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80' // Newspaper generic
};

// Comprehensive RSS Feed sources for all categories
// Using English-only feeds that work reliably, then categorizing based on content
const RSS_SOURCES = {
  en: [
    // Priority: Nellore & Andhra Pradesh
    'https://news.google.com/rss/search?q=Nellore+news&hl=en-IN&gl=IN&ceid=IN:en',
    'https://news.google.com/rss/search?q=Andhra+Pradesh+news&hl=en-IN&gl=IN&ceid=IN:en',
    // General India News (Secondary)
    'https://news.google.com/rss/search?q=India&hl=en-IN&gl=IN&ceid=IN:en',
    // World News
    'https://news.google.com/rss/search?q=world+news&hl=en-IN&gl=IN&ceid=IN:en',
    // Business
    'https://news.google.com/rss/search?q=business&hl=en-IN&gl=IN&ceid=IN:en',
    // Tech
    'https://news.google.com/rss/search?q=technology&hl=en-IN&gl=IN&ceid=IN:en',
    // Sports
    'https://news.google.com/rss/search?q=cricket+india&hl=en-IN&gl=IN&ceid=IN:en',
    // Entertainment
    'https://news.google.com/rss/search?q=tollywood&hl=en-IN&gl=IN&ceid=IN:en', // Tollywood priority
  ],
  te: [
    // Priority: Nellore & Andhra Pradesh (Telugu)
    'https://news.google.com/rss/search?q=Nellore+news+telugu&hl=te&gl=IN&ceid=IN:te',
    'https://news.google.com/rss/search?q=Andhra+Pradesh+news+telugu&hl=te&gl=IN&ceid=IN:te',
    'https://news.google.com/rss/search?q=Telangana+news+telugu&hl=te&gl=IN&ceid=IN:te',
    // Localized categories
    'https://news.google.com/rss/search?q=Andhra+Pradesh+Politics+telugu&hl=te&gl=IN&ceid=IN:te',
    'https://news.google.com/rss/search?q=Tollywood+news+telugu&hl=te&gl=IN&ceid=IN:te',
    // General
    'https://news.google.com/rss/search?q=India&hl=te&gl=IN&ceid=IN:te',
  ]
};

// Category mapping based on keywords
const CATEGORY_KEYWORDS = {
  india: {
    en: ['india', 'indian', 'delhi', 'mumbai', 'bengaluru', 'chennai', 'kolkata', 'hyderabad', 'pune', 'ahmedabad', 'andhra pradesh', 'telangana', 'tamil nadu', 'kerala', 'karnataka', 'maharashtra', 'gujarat', 'rajasthan', 'uttar pradesh', 'west bengal', 'bihar', 'odisha', 'punjab', 'haryana', 'government', 'pm', 'prime minister', 'modi', 'parliament', 'lok sabha', 'rajya sabha'],
    te: ['భారత్', 'భారత', 'దిల్లీ', 'ముంబై', 'బెంగళూరు', 'చెన్నై', 'కోల్కతా', 'హైదరాబాద్', 'పూణే', 'అహ్మదాబాద్', 'ఆంధ్రప్రదేశ్', 'తెలంగాణ', 'తమిళనాడు', 'కేరళ', 'కర్ణాటక', 'మహారాష్ట్ర', 'గుజరాత్', 'రాజస్థాన్', 'ఉత్తరప్రదేశ్', 'పశ్చిమ బెంగాల్', 'బీహార్', 'ఒడిషా', 'పంజాబ్', 'హర్యానా', 'ప్రభుత్వం', 'ప్రధానమంత్రి', 'పార్లమెంట్']
  },
  world: {
    en: ['world', 'international', 'global', 'usa', 'united states', 'china', 'russia', 'uk', 'united kingdom', 'europe', 'asia', 'africa', 'middle east', 'un', 'united nations', 'nato', 'eu', 'european union'],
    te: ['ప్రపంచం', 'అంతర్జాతీయ', 'అమెరికా', 'చైనా', 'రష్యా', 'యూరోప్', 'ఆసియా', 'ఆఫ్రికా', 'మధ్యప్రాచ్యం', 'యునైటెడ్ నేషన్స్']
  },
  business: {
    en: ['business', 'economy', 'economic', 'gdp', 'inflation', 'trade', 'commerce', 'industry', 'corporate', 'company', 'companies', 'enterprise'],
    te: ['వ్యాపారం', 'ఆర్థికం', 'ఆర్థిక', 'జిడిపి', 'ప్రభావం', 'వాణిజ్యం', 'పరిశ్రమ', 'కార్పొరేట్', 'కంపెనీ']
  },
  markets: {
    en: ['stock', 'market', 'nse', 'bse', 'sensex', 'nifty', 'share', 'shares', 'trading', 'invest', 'investment', 'mutual fund', 'ipo', 'equity', 'bonds'],
    te: ['శేర్', 'మార్కెట్', 'ఎన్ఎస్ఈ', 'బీఎస్ఈ', 'సెన్సెక్స్', 'నిఫ్టీ', 'వాణిజ్యం', 'పెట్టుబడి', 'మ్యూచువల్ ఫండ్']
  },
  tech: {
    en: ['technology', 'tech', 'digital', 'ai', 'artificial intelligence', 'startup', 'startups', 'innovation', 'software', 'app', 'mobile', 'internet', 'cyber', 'it', 'information technology'],
    te: ['టెక్నాలజీ', 'డిజిటల్', 'కృత్రిమ మేధస్సు', 'స్టార్టప్', 'నవీకరణ', 'సాఫ్ట్వేర్', 'అప్లికేషన్', 'మొబైల్', 'ఇంటర్నెట్', 'సైబర్']
  },
  sports: {
    en: ['sports', 'cricket', 'football', 'hockey', 'tennis', 'badminton', 'olympics', 'ipl', 'bcci', 'fifa', 'match', 'tournament', 'championship'],
    te: ['క్రీడలు', 'క్రికెట్', 'ఫుట్బాల్', 'హాకీ', 'టెన్నిస్', 'బ్యాడ్మింటన్', 'ఒలింపిక్స్', 'ఐపీఎల్', 'బీసీసీఐ', 'మ్యాచ్', 'టోర్నమెంట్']
  },
  entertainment: {
    en: ['entertainment', 'bollywood', 'hollywood', 'movie', 'movies', 'film', 'cinema', 'actor', 'actress', 'celebrity', 'music', 'song', 'singer'],
    te: ['వినోదం', 'బాలీవుడ్', 'హాలీవుడ్', 'సినిమా', 'చిత్రం', 'నటుడు', 'నటి', 'ప్రసిద్ధి', 'సంగీతం', 'పాట', 'గాయకుడు']
  },
  lifestyle: {
    en: ['lifestyle', 'fashion', 'food', 'travel', 'health', 'fitness', 'wellness', 'beauty', 'trends', 'culture'],
    te: ['జీవనశైలి', 'ఫ్యాషన్', 'ఆహారం', 'ప్రయాణం', 'ఆరోగ్యం', 'ఫిట్నెస్', 'సౌందర్యం', 'ప్రవృత్తులు', 'సంస్కృతి']
  },
  opinion: {
    en: ['opinion', 'editorial', 'column', 'analysis', 'viewpoint', 'perspective', 'commentary', 'op-ed'],
    te: ['అభిప్రాయం', 'సంపాదకీయం', 'కాలమ్', 'విశ్లేషణ', 'వీక్షణ', 'వ్యాఖ్య']
  }
};


// Helper function to create slug from title
const createSlug = (title, language) => {
  let slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // Add language prefix to avoid conflicts
  return `${language}-${slug}-${nanoid(6)}`;
};

// Helper function to extract image from content - IMPROVED to get actual news images
const extractImage = async (link) => {
  try {
    const response = await axios.get(link, {
      timeout: 10000,
      maxRedirects: 10, // Increased follow redirects
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });

    // Check if we got redirected to a different host
    const finalUrl = response.request.res.responseUrl || link;

    // Check if it looks like a blocked or login page
    if (finalUrl.includes('login') || finalUrl.includes('subscribe') || finalUrl.includes('captcha')) {
      return null;
    }

    const $ = cheerio.load(response.data);

    // Priority 1: Open Graph and Twitter Card images (most reliable)
    let image = $('meta[property="og:image"]').attr('content') ||
      $('meta[name="og:image"]').attr('content') ||
      $('meta[property="twitter:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[name="twitter:image:src"]').attr('content') ||
      $('meta[property="og:image:secure_url"]').attr('content') ||
      $('link[rel="image_src"]').attr('href');

    // Priority 2: JSON-LD Structured Data
    if (!image) {
      try {
        const jsonLd = $('script[type="application/ld+json"]').html();
        if (jsonLd) {
          const parsed = JSON.parse(jsonLd);
          if (parsed.image) {
            image = Array.isArray(parsed.image) ? parsed.image[0] : (parsed.image.url || parsed.image);
          } else if (parsed.thumbnailUrl) {
            image = parsed.thumbnailUrl;
          }
        }
      } catch (e) {
        // ignore json parse errors
      }
    }


    // Priority 3: Article-specific image selectors
    if (!image) {
      const articleSelectors = [
        'article img[src]',
        'article img[data-src]',
        'article img[data-lazy-src]',
        'article img[data-original]',
        '.article-image img',
        '.article-header img',
        '.article-thumbnail img',
        '.post-image img',
        '.post-thumbnail img',
        '.entry-image img',
        '.entry-thumbnail img',
        '.featured-image img',
        '.featured-thumbnail img',
        '.hero-image img',
        '.main-image img',
        '.story-image img',
        '[class*="article"] img[src]',
        '[class*="post"] img[src]',
        '[class*="story"] img[src]',
        '[class*="featured"] img[src]',
        '[id*="article"] img[src]',
        '[id*="post"] img[src]',
        '[id*="featured"] img[src]'
      ];

      for (const selector of articleSelectors) {
        const img = $(selector).first();
        if (img.length) {
          image = img.attr('src') || img.attr('data-src') || img.attr('data-lazy-src') || img.attr('data-original');
          if (image) break;
        }
      }
    }

    // Normalize and validate image URL
    if (image) {
      // Convert relative URLs to absolute
      if (image.startsWith('//')) {
        image = `https:${image}`;
      } else if (image.startsWith('/')) {
        try {
          const url = new URL(finalUrl);
          image = `${url.protocol}//${url.host}${image}`;
        } catch {
          return null;
        }
      } else if (!image.startsWith('http')) {
        return null;
      }

      // Remove query parameters that might break the URL (but keep some that might be needed)
      // CAUTION: Some CDNs need params. For now, keep params if it looks like a CDN.
      // const urlParts = image.split('?');
      // image = urlParts[0];

      // Validate it's actually an image URL - exclude placeholder services
      const placeholderServices = [
        'picsum.photos',
        'via.placeholder.com',
        'placeholder.com',
        'placehold.it',
        'dummyimage.com',
        'fakeimg.pl',
        'fakeimg.pl',
        'google.com/images/branding/googlelogo', // Explicitly block google logo
        'gstatic.com' // Block gstatic generic icons
      ];

      const isPlaceholder = placeholderServices.some(service => image.includes(service));
      if (isPlaceholder) {
        return null; // Don't use placeholder images
      }

      // Explicitly reject known "Google News" generic thumbnails if they slip through
      if (image.includes('googleusercontent.com') || image.includes('gstatic.com')) {
        // Block small letter avatars or generic publisher logos often hosted here
        // s100, s32 = small size.
        if (image.includes('=s') && (image.includes('=s32') || image.includes('=s64') || image.includes('=s100'))) {
          return null;
        }
      }

      return image;
    }

    return null;
  } catch (err) {
    // Log error but don't fail - return null to try other methods
    // console.warn(`Image extraction failed for ${link}:`, err.message);
    return null;
  }
};

// Detect category from article content
const detectCategory = async (title, description, language) => {
  const text = `${title} ${description || ''}`.toLowerCase();

  // Track best matching category
  let bestMatch = null;
  let bestScore = 0;

  // Check each category
  for (const [categorySlug, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const categoryKeywords = keywords[language] || keywords.en;
    const matchCount = categoryKeywords.filter(keyword =>
      text.includes(keyword.toLowerCase())
    ).length;

    // Score based on matches (more matches = higher score)
    const score = matchCount;

    if (score > bestScore) {
      bestScore = score;
      const category = await CategoryModel.findOne({ slug: categorySlug });
      if (category) {
        bestMatch = category;
      }
    }
  }

  // If we found a match (even with 1 keyword), use it
  if (bestMatch && bestScore > 0) {
    return bestMatch;
  }

  // Default to India category
  return await CategoryModel.findOne({ slug: 'india' }) ||
    await CategoryModel.findOne({ slug: 'world' }) ||
    await getDefaultCategory(language);
};

// Check if article should be marked as breaking news
const isBreakingNews = (title, description, publishedAt) => {
  const text = `${title} ${description || ''}`.toLowerCase();
  const breakingKeywords = ['breaking', 'urgent', 'alert', 'latest', 'just in', 'developing', 'live', 'emergency', 'crisis'];
  const hasBreakingKeyword = breakingKeywords.some(keyword => text.includes(keyword));

  // Also mark as breaking if published in last 2 hours
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const isRecent = publishedAt && new Date(publishedAt) > twoHoursAgo;

  return hasBreakingKeyword || isRecent;
};

// Clean HTML content
const cleanHtml = (html) => {
  if (!html) return '';
  const $ = cheerio.load(html);
  return $.text().trim().substring(0, 500); // Limit to 500 chars for summary
};

// Fetch default category or create one
const getDefaultCategory = async (language) => {
  let category = await CategoryModel.findOne({
    slug: language === 'te' ? 'nellore-telugu' : 'nellore-english'
  });

  if (!category) {
    category = await CategoryModel.findOne({ slug: 'national' });
    if (!category) {
      // Create a default category if none exists
      category = await CategoryModel.create({
        title: language === 'te' ? 'నెల్లూరు వార్తలు' : 'Nellore News',
        slug: language === 'te' ? 'nellore-telugu' : 'nellore-english',
        description: language === 'te' ? 'నెల్లూరు, ఆంధ్రప్రదేశ్ నుండి తాజా వార్తలు' : 'Latest news from Nellore, Andhra Pradesh'
      });
    }
  }

  return category;
};

// Get or create system user for aggregated articles
const getSystemUser = async () => {
  // Try to find existing system user
  let user = await UserModel.findOne({ email: 'system@newsroom.local' }).catch(() => null);

  if (!user) {
    // Try to find any existing user
    user = await UserModel.findOne({}).limit(1);

    if (!user) {
      // Create system user if no users exist
      try {
        const bcrypt = await import('bcryptjs');
        const passwordHash = await bcrypt.default.hash('system-user-' + Date.now(), 10);

        user = await UserModel.create({
          email: `system-${Date.now()}@newsroom.local`,
          passwordHash: passwordHash,
          profile: {
            name: 'News Aggregator'
          },
          role: 'user',
          status: 'active'
        });
      } catch {
        // If creation fails, try to find any user again
        user = await UserModel.findOne({}).limit(1);
        if (!user) {
          throw new Error('No users found. Please run seed script first.');
        }
      }
    }
  }

  return user;
};

// Fetch news from a single RSS feed with proper URL encoding
const fetchFromRSS = async (feedUrl, language) => {
  try {
    // Properly encode URL to handle Telugu characters
    let encodedUrl = feedUrl;
    try {
      const url = new URL(feedUrl);
      // For Google News RSS, properly encode the query parameter
      if (url.hostname.includes('news.google.com')) {
        const queryMatch = feedUrl.match(/[?&]q=([^&]+)/);
        if (queryMatch) {
          const originalQuery = queryMatch[1];
          // Decode first, then re-encode properly
          const decoded = decodeURIComponent(originalQuery);
          const encoded = encodeURIComponent(decoded);
          encodedUrl = feedUrl.replace(originalQuery, encoded);
        }
      } else {
        // For other URLs, use standard encoding
        encodedUrl = encodeURI(feedUrl);
      }
    } catch {
      // If URL parsing fails, use original with basic encoding
      encodedUrl = encodeURI(feedUrl);
    }

    const feed = await parser.parseURL(encodedUrl);
    const articles = [];

    for (const item of feed.items || []) {
      if (!item.title || !item.link) continue;

      const title = item.title || '';
      const description = item.contentSnippet || item.content || item.description || '';
      const publishedAt = item.pubDate ? new Date(item.pubDate) : new Date();

      // Check if article already exists
      const existingArticle = await ArticleModel.findOne({ sourceUrl: item.link });
      if (existingArticle) {
        continue; // Skip if already exists
      }

      // Detect category
      const category = await detectCategory(title, description, language);

      // Check if breaking news
      const isBreaking = isBreakingNews(title, description, publishedAt);

      // Extract image from RSS item - try multiple sources
      let rssImage = null;

      // Try enclosure first (most reliable)
      if (item.enclosure && item.enclosure.url) {
        if (item.enclosure.type && item.enclosure.type.startsWith('image/')) {
          rssImage = item.enclosure.url;
        } else if (item.enclosure.url.match(/\.(jpg|jpeg|png|gif|webp)/i)) {
          rssImage = item.enclosure.url;
        }
      }

      // Try media:content
      if (!rssImage && item['media:content']) {
        if (item['media:content'].$ && item['media:content'].$.url) {
          rssImage = item['media:content'].$.url;
        } else if (Array.isArray(item['media:content']) && item['media:content'][0] && item['media:content'][0].$.url) {
          rssImage = item['media:content'][0].$.url;
        }
      }

      // Try media:thumbnail
      if (!rssImage && item['media:thumbnail']) {
        if (item['media:thumbnail'].$ && item['media:thumbnail'].$.url) {
          rssImage = item['media:thumbnail'].$.url;
        } else if (Array.isArray(item['media:thumbnail']) && item['media:thumbnail'][0] && item['media:thumbnail'][0].$.url) {
          rssImage = item['media:thumbnail'][0].$.url;
        }
      }

      // Try extracting from content HTML - improved regex to catch more patterns
      if (!rssImage && item.content) {
        // Try multiple patterns for img tags
        const imgPatterns = [
          /<img[^>]+src=["']([^"']+)["']/i,
          /<img[^>]+data-src=["']([^"']+)["']/i,
          /<img[^>]+data-lazy-src=["']([^"']+)["']/i,
          /<img[^>]+data-original=["']([^"']+)["']/i
        ];

        for (const pattern of imgPatterns) {
          const imgMatch = item.content.match(pattern);
          if (imgMatch && imgMatch[1]) {
            let imgSrc = imgMatch[1];

            // Skip placeholder images
            const placeholderServices = ['picsum.photos', 'via.placeholder.com', 'placeholder.com', 'placehold.it', 'dummyimage.com'];
            if (placeholderServices.some(service => imgSrc.includes(service))) {
              continue;
            }

            // Convert relative URLs to absolute
            if (imgSrc.startsWith('//')) {
              imgSrc = `https:${imgSrc}`;
            } else if (imgSrc.startsWith('/') && item.link) {
              try {
                const url = new URL(item.link);
                imgSrc = `${url.protocol}//${url.host}${imgSrc}`;
              } catch {
                continue;
              }
            }
            if (imgSrc.startsWith('http') && !imgSrc.includes('placeholder') && !imgSrc.includes('picsum')) {
              rssImage = imgSrc;
              break;
            }
          }
        }
      }

      // Only add article if it has a real image (will be validated later in saveArticles)
      // We'll try to extract image from the article URL during save if RSS didn't provide one
      articles.push({
        title: title.substring(0, 200), // Limit title length
        subTitle: description.substring(0, 150) || undefined,
        slug: createSlug(title, language),
        summary: cleanHtml(description).substring(0, 300) || undefined,
        body: cleanHtml(item.content || description) || cleanHtml(description) || title,
        heroImage: rssImage || null, // May be null - will extract from article URL during save
        sourceUrl: item.link,
        sourceName: feed.title || 'RSS Feed',
        source: 'rss',
        language: language,
        category: category._id,
        categorySlug: category.slug, // Pass slug for fallback image selection
        publishedAt: publishedAt,
        isAggregated: true,
        location: {
          country: 'India'
        },
        status: 'published',
        flags: {
          isBreaking: isBreaking,
          isTopHeadline: isBreaking || false
        },
        stats: {
          views: Math.floor(Math.random() * 1000),
          readTime: Math.floor(Math.random() * 5) + 3,
          shares: Math.floor(Math.random() * 50)
        },
        tags: extractTags(title + ' ' + description, language)
      });
    }

    return articles;
  } catch (error) {
    console.error(`Error fetching RSS feed ${feedUrl}:`, error.message);
    return [];
  }
};

// Extract tags from text
const extractTags = (text, language) => {
  const tags = [];
  const textLower = text.toLowerCase();

  const tagKeywords = {
    en: ['politics', 'business', 'sports', 'education', 'health', 'weather', 'traffic'],
    te: ['రాజకీయాలు', 'వ్యాపారం', 'క్రీడలు', 'విద్య', 'ఆరోగ్యం', 'వాతావరణం']
  };

  const keywords = tagKeywords[language] || tagKeywords.en;
  keywords.forEach(keyword => {
    if (textLower.includes(keyword.toLowerCase())) {
      tags.push(keyword);
    }
  });

  return tags;
};

// Save articles to database
const saveArticles = async (articles, language) => {
  if (articles.length === 0) return { saved: 0, skipped: 0 };

  const author = await getSystemUser();

  let saved = 0;
  let skipped = 0;

  for (const articleData of articles) {
    try {
      // Check if article with same source URL exists
      const existing = await ArticleModel.findOne({ sourceUrl: articleData.sourceUrl });
      if (existing) {
        skipped++;
        continue;
      }

      // CRITICAL: Only save articles with real news images - NO PLACEHOLDERS
      // Try multiple methods to extract image from article
      let extractedImage = articleData.heroImage || null;

      // Method 1: If RSS already provided an image, validate it's not a placeholder
      if (extractedImage) {
        const placeholderServices = ['picsum.photos', 'via.placeholder.com', 'placeholder.com', 'placehold.it', 'dummyimage.com', 'placehold.co'];
        if (placeholderServices.some(service => extractedImage.includes(service))) {
          extractedImage = null; // Reject placeholder
        }
      }

      // Method 2: Extract from article URL if no valid image yet
      if (!extractedImage && articleData.sourceUrl) {
        try {
          // First try direct extraction from article URL
          extractedImage = await extractImage(articleData.sourceUrl);

          // If that fails, try Google News redirect URL
          if (!extractedImage) {
            const googleThumbMatch = articleData.sourceUrl.match(/url=([^&]+)/);
            if (googleThumbMatch) {
              try {
                const actualUrl = decodeURIComponent(googleThumbMatch[1]);
                extractedImage = await extractImage(actualUrl);
              } catch {
                // Continue to next method
              }
            }
          }
        } catch (err) {
          console.warn(`Image extraction error for ${articleData.sourceUrl}:`, err.message);
        }
      }

      // Method 3: Try to get from RSS content/body if available
      if (!extractedImage && articleData.body) {
        const imgPatterns = [
          /<img[^>]+src=["']([^"']+)["']/i,
          /<img[^>]+data-src=["']([^"']+)["']/i,
          /<img[^>]+data-lazy-src=["']([^"']+)["']/i,
          /<img[^>]+data-original=["']([^"']+)["']/i
        ];

        for (const pattern of imgPatterns) {
          const imgMatch = articleData.body.match(pattern);
          if (imgMatch && imgMatch[1]) {
            let imgSrc = imgMatch[1];

            // Skip placeholder images
            const placeholderServices = ['picsum.photos', 'via.placeholder.com', 'placeholder.com', 'placehold.it', 'dummyimage.com', 'placehold.co'];
            if (placeholderServices.some(service => imgSrc.includes(service))) {
              continue;
            }

            if (imgSrc.startsWith('//')) {
              imgSrc = `https:${imgSrc}`;
            } else if (imgSrc.startsWith('/') && articleData.sourceUrl) {
              try {
                const url = new URL(articleData.sourceUrl);
                imgSrc = `${url.protocol}//${url.host}${imgSrc}`;
              } catch {
                continue;
              }
            }
            if (imgSrc.startsWith('http') && !imgSrc.includes('placeholder') && !imgSrc.includes('picsum') && !imgSrc.includes('dummyimage')) {
              extractedImage = imgSrc;
              break;
            }
          }
        }
      }

      // Final validation: Ensure we have a real news image (not placeholder)
      // If we STILL don't have an image, use a CATEGORY FALLBACK instead of skipping
      // This solves "generic google image" vs "missing content" trade-off

      const placeholderServices = ['picsum.photos', 'via.placeholder.com', 'placeholder.com', 'placehold.it', 'dummyimage.com', 'placehold.co', 'googlelogo'];
      const isPlaceholder = extractedImage && placeholderServices.some(service => extractedImage.includes(service));

      if (!extractedImage || isPlaceholder) {
        // Use category fallback logic
        const catKey = articleData.categorySlug ? articleData.categorySlug.split('-')[0] : 'default'; // e.g., 'politics' from 'politics-english'
        extractedImage = CATEGORY_FALLBACKS[catKey] || CATEGORY_FALLBACKS.default;
        console.log(`⚠️ Using fallback image for: ${articleData.title.substring(0, 30)}... [${catKey}]`);
      }

      // Set the validated real news image
      articleData.heroImage = extractedImage;

      // Clean up temp field
      delete articleData.categorySlug;

      // Ensure category exists
      if (!articleData.category) {
        articleData.category = (await getDefaultCategory(language))._id;
      }

      // Create article
      await ArticleModel.create({
        ...articleData,
        author: author._id,
        tags: [...(articleData.tags || []), 'News', 'India']
      });

      saved++;
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate slug - regenerate
        articleData.slug = createSlug(articleData.title + ' ' + Date.now(), language);
        try {
          await ArticleModel.create({
            ...articleData,
            author: author._id
          });
          saved++;
        } catch {
          skipped++;
        }
      } else {
        console.error('Error saving article:', error.message);
        skipped++;
      }
    }
  }

  return { saved, skipped };
};

// Main aggregation function
export const aggregateNews = async (language = 'te') => {
  console.log(`Starting news aggregation for language: ${language}`);

  const sources = RSS_SOURCES[language] || RSS_SOURCES.te;
  const allArticles = [];

  // Fetch from all RSS sources
  for (const feedUrl of sources) {
    try {
      console.log(`Fetching from: ${feedUrl}`);
      const articles = await fetchFromRSS(feedUrl, language);
      allArticles.push(...articles);

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error processing feed ${feedUrl}:`, error.message);
    }
  }

  console.log(`Found ${allArticles.length} articles for ${language}`);

  // Remove duplicates based on title similarity
  const uniqueArticles = [];
  const seenTitles = new Set();

  for (const article of allArticles) {
    const titleKey = article.title.toLowerCase().substring(0, 50);
    if (!seenTitles.has(titleKey)) {
      seenTitles.add(titleKey);
      uniqueArticles.push(article);
    }
  }

  console.log(`After deduplication: ${uniqueArticles.length} articles`);

  // Save to database
  const result = await saveArticles(uniqueArticles, language);

  console.log(`Aggregation complete - Saved: ${result.saved}, Skipped: ${result.skipped}`);

  return {
    language,
    total: uniqueArticles.length,
    saved: result.saved,
    skipped: result.skipped
  };
};

// Aggregate news for both languages
export const aggregateAllNews = async () => {
  const results = {};

  // Aggregate Telugu news first (priority)
  results.te = await aggregateNews('te');

  // Add delay between language aggregations
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Aggregate English news
  results.en = await aggregateNews('en');

  return results;
};

import axios from 'axios';
import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: ['media:group', 'media:thumbnail', 'yt:videoId']
  }
});

// Cache channelId lookups to reduce repeated HTML fetches
const channelIdCache = new Map();

/**
 * Resolve YouTube channel ID from handle (e.g., @chinnap9430)
 * Uses YouTube's page to extract channel ID
 */
const resolveChannelIdFromHandle = async (handle) => {
  if (!handle) return null;

  // Normalize handle (ensure it starts with @)
  const normalizedHandle = handle.startsWith('@') ? handle : `@${handle}`;
  
  // Return cached if available
  if (channelIdCache.has(normalizedHandle)) {
    return channelIdCache.get(normalizedHandle);
  }

  try {
    // Fetch handle page with proper @ symbol
    const url = `https://www.youtube.com/${normalizedHandle}`;
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      maxRedirects: 5,
      validateStatus: (status) => status < 500 // Accept redirects
    });

    // Try multiple patterns to find channel ID
    const patterns = [
      /"channelId":"(UC[a-zA-Z0-9_-]{22})"/,
      /"externalId":"([^"]+)"/,
      /"browseId":"(UC[a-zA-Z0-9_-]{22})"/,
      /channelId["\s]*:["\s]*["'](UC[a-zA-Z0-9_-]{22})["']/,
    ];

    for (const pattern of patterns) {
      const match = response.data.match(pattern);
      if (match && match[1] && match[1].startsWith('UC')) {
        const channelId = match[1];
        channelIdCache.set(normalizedHandle, channelId);
        return channelId;
      }
    }

    // If no channel ID found, return null (will be handled gracefully)
    console.warn(`Could not extract channel ID for handle: ${normalizedHandle}`);
    return null;
  } catch (error) {
    console.error(`Error resolving YouTube channel ID for ${normalizedHandle}:`, error.message);
    return null;
  }
};

const mapVideo = (item) => {
  // Extract video ID from various possible formats
  const videoId = item.id?.split(':')?.[2] || item['yt:videoId'] || item.link?.split('/watch?v=')?.[1]?.split('&')?.[0];
  
  // Get thumbnail - try multiple sources
  const thumb = 
    item['media:group']?.['media:thumbnail']?.[0]?.$.url ||
    (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null) ||
    item.enclosure?.url ||
    null;

  return {
    id: item.id || videoId || `video-${Date.now()}`,
    title: item.title || 'Untitled Video',
    link: item.link || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : '#'),
    publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
    thumbnail: thumb || 'https://via.placeholder.com/640x360?text=Video',
    description: item.contentSnippet || item.content || item.summary || '',
    channelTitle: item.author || 'NLR Channel',
  };
};

export const YouTubeService = {
  /**
   * Fetch latest videos for a channel
   * @param {object} opts
   * @param {string} opts.channelId - YouTube channel ID (UC...)
   * @param {string} opts.channelHandle - YouTube handle (e.g., @chinnap9430)
   * @param {number} opts.limit - number of videos to return
   */
  getChannelVideos: async ({ channelId, channelHandle, limit = 8 } = {}) => {
    try {
      let id = channelId;
      
      // Resolve channel ID from handle if needed
      if (!id && channelHandle) {
        id = await resolveChannelIdFromHandle(channelHandle);
      }

      if (!id) {
        console.warn('YouTube: No channel ID or handle provided, or could not resolve channel ID');
        return []; // Return empty array instead of throwing
      }

      // Use RSS feed with channel ID
      const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${id}`;
      
      try {
        const feed = await parser.parseURL(feedUrl);
        const items = feed.items || [];
        return items.slice(0, limit).map(mapVideo);
      } catch (feedError) {
        console.error(`Error fetching YouTube RSS feed for channel ${id}:`, feedError.message);
        return []; // Return empty array on feed error
      }
    } catch (error) {
      console.error('YouTube Service Error:', error.message);
      return []; // Return empty array instead of throwing
    }
  }
};


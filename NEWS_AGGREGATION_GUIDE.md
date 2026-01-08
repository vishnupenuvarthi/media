# Dynamic News Aggregation System - Nellore, Andhra Pradesh

## Overview

This system automatically fetches and aggregates news articles from multiple sources about Nellore, Andhra Pradesh. The news is displayed in both English and Telugu (primarily Telugu) across all sections of the application.

## Features

- **Multi-source RSS aggregation**: Fetches news from Google News RSS feeds and other Telugu/English news sources
- **Automatic filtering**: Only includes news related to Nellore, Andhra Pradesh
- **Dual language support**: Supports both English (en) and Telugu (te) content
- **Automatic scheduling**: Runs every 30 minutes to keep content fresh
- **Deduplication**: Automatically prevents duplicate articles
- **Image extraction**: Attempts to extract images from source articles

## How It Works

### 1. Scheduled Aggregation

The system runs automatically every 30 minutes, fetching news from configured RSS sources:

- **Telugu Sources**:
  - Google News RSS for "నెల్లూరు ఆంధ్రప్రదేశ్" (Nellore Andhra Pradesh)
  - Google News RSS for "నెల్లూరు వార్తలు" (Nellore news)
  - ETV Bharat Telugu RSS feeds
  - Sakshi Telugu RSS feeds

- **English Sources**:
  - Google News RSS for "Nellore Andhra Pradesh"
  - Google News RSS for "Nellore news"

### 2. Filtering Process

Articles are filtered to ensure they're relevant to Nellore using keyword matching:

- **English keywords**: nellore, nellore district, nellore city, andhra pradesh, ap
- **Telugu keywords**: నెల్లూరు, నెల్లూరు జిల్లా, నెల్లూరు నగరం, ఆంధ్రప్రదేశ్, ఏపి

### 3. Storage

- Articles are stored in MongoDB with metadata:
  - Language (en/te)
  - Source URL and name
  - Location (city: Nellore, state: Andhra Pradesh)
  - Aggregation flag
  - Automatic categorization

## API Endpoints

### Trigger Aggregation Manually

```bash
# Aggregate news for Telugu
POST /api/news-aggregator/aggregate/te

# Aggregate news for English
POST /api/news-aggregator/aggregate/en

# Aggregate news for both languages
POST /api/news-aggregator/aggregate
```

### Check Aggregation Status

```bash
GET /api/news-aggregator/status
```

Response:
```json
{
  "success": true,
  "stats": {
    "total": 150,
    "telugu": 100,
    "english": 50,
    "nellore": 150
  }
}
```

## Display in Frontend

The frontend automatically displays aggregated news based on the selected language:

1. **Language Selection**: Users can switch between Telugu (te) and English (en)
2. **Automatic Filtering**: All sections (Hero, Latest, Trending, Breaking News) automatically show Nellore-related news
3. **Real-time Updates**: Content updates every 30 minutes automatically

### Language Parameter

All API endpoints accept a `lang` query parameter:

```javascript
// Fetch Telugu news (default)
/api/home?lang=te

// Fetch English news
/api/home?lang=en

// Breaking news
/api/articles?flag=breaking&lang=te
```

## Configuration

### RSS Sources

Edit `backend/src/services/newsAggregator.service.js` to add/remove RSS sources:

```javascript
const RSS_SOURCES = {
  en: [
    'https://news.google.com/rss/search?q=Nellore+Andhra+Pradesh&hl=en-IN&gl=IN&ceid=IN:en',
    // Add more English sources here
  ],
  te: [
    'https://news.google.com/rss/search?q=నెల్లూరు+ఆంధ్రప్రదేశ్&hl=te&gl=IN&ceid=IN:te',
    // Add more Telugu sources here
  ]
};
```

### Aggregation Schedule

Edit `backend/src/services/newsScheduler.service.js` to change the schedule:

```javascript
// Current: Every 30 minutes
cron.schedule('*/30 * * * *', () => {
  // Change to every hour: '0 * * * *'
  // Change to every 15 minutes: '*/15 * * * *'
});
```

### Keywords for Filtering

Update keywords in `backend/src/services/newsAggregator.service.js`:

```javascript
const NELLORE_KEYWORDS = {
  en: ['nellore', 'nellore district', ...],
  te: ['నెల్లూరు', 'నెల్లూరు జిల్లా', ...]
};
```

## Manual Setup

### First-Time Setup

1. **Start the backend server**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Trigger initial aggregation**:
   ```bash
   curl -X POST http://localhost:5000/api/news-aggregator/aggregate
   ```

3. **Verify articles are created**:
   ```bash
   curl http://localhost:5000/api/news-aggregator/status
   ```

### Testing

Test the aggregation system:

```bash
# Test Telugu aggregation
curl -X POST http://localhost:5000/api/news-aggregator/aggregate/te

# Test English aggregation
curl -X POST http://localhost:5000/api/news-aggregator/aggregate/en

# Check status
curl http://localhost:5000/api/news-aggregator/status
```

## Troubleshooting

### No Articles Being Fetched

1. **Check RSS feed URLs**: Some RSS feeds may be blocked or require authentication
2. **Check network connectivity**: Ensure the server can access external RSS feeds
3. **Check logs**: Look for errors in the console output
4. **Verify keywords**: Ensure articles contain Nellore-related keywords

### Articles Not Displaying

1. **Check language setting**: Ensure frontend is using correct language parameter
2. **Check article status**: Articles must be `published` to display
3. **Verify location data**: Articles must have `location.city: 'Nellore'` or `isAggregated: true`

### Duplicate Articles

- The system automatically prevents duplicates by checking `sourceUrl`
- If duplicates appear, check that `sourceUrl` is being set correctly

## Database Schema

Articles stored by the aggregator include:

```javascript
{
  title: String,
  slug: String,
  body: String,
  summary: String,
  heroImage: String,
  language: 'en' | 'te',
  source: 'rss' | 'newsapi' | 'scraper',
  sourceUrl: String,
  sourceName: String,
  location: {
    city: 'Nellore',
    state: 'Andhra Pradesh',
    country: 'India'
  },
  isAggregated: true,
  status: 'published',
  tags: [String],
  publishedAt: Date
}
```

## Next Steps

1. **Add more RSS sources**: Include more Telugu news websites
2. **Improve filtering**: Add more sophisticated filtering logic
3. **Add caching**: Cache RSS feeds to reduce load
4. **Add translation**: Automatically translate English articles to Telugu
5. **Add notifications**: Notify users of breaking news

## Support

For issues or questions, check the logs in the backend console or MongoDB database.



# ✅ How to Get Articles Displaying in All Sections

## 🎯 Problem
- Breaking news not showing
- Category sections (India, World, Business, etc.) are empty
- No articles displaying dynamically

## ✅ Solution

### Step 1: Re-run Seed Script (Creates Base Articles)

This creates 80+ articles across all categories with breaking news:

```bash
cd backend
npm run seed
```

**This will create:**
- ✅ 80+ articles across all 10 categories
- ✅ 15 breaking news articles (marked with `flags.isBreaking: true`)
- ✅ Articles in India, World, Business, Markets, Tech, Sports, Entertainment, Lifestyle, Opinion
- ✅ Mix of Telugu and English articles

### Step 2: Trigger Web Scraping (Gets Real News)

This scrapes real news from RSS feeds and adds to your database:

```bash
cd backend
npm run scrape
```

**This will:**
- ✅ Fetch news from Google News RSS feeds
- ✅ Automatically categorize articles
- ✅ Mark breaking news dynamically
- ✅ Save to database

**OR use the API endpoint:**

```bash
# Trigger scraping via API
curl -X POST http://localhost:5001/api/news-aggregator/aggregate
```

### Step 3: Verify Articles Are Created

Check if articles exist:

```bash
# In MongoDB shell or Compass
db.articles.countDocuments({ status: 'published' })
# Should return 80+ (from seed) + scraped articles
```

### Step 4: Check Breaking News

```bash
# In MongoDB shell
db.articles.countDocuments({ 'flags.isBreaking': true })
# Should return 15+ (from seed) + dynamically marked breaking news
```

### Step 5: Restart Backend

```bash
cd backend
npm run dev
```

### Step 6: Refresh Frontend

Open `http://localhost:5174` and you should see:
- ✅ Breaking news ticker at top
- ✅ Articles in all category sections
- ✅ Hero section with featured articles
- ✅ Latest feed with recent articles
- ✅ Trending sidebar with popular articles

---

## 🔄 Automatic Scraping

The system automatically scrapes news every 30 minutes. You can see it in backend logs:

```
📅 Starting news aggregation scheduler...
Starting scheduled news aggregation...
```

---

## 🧪 Manual Testing

### Test Breaking News:
```bash
curl http://localhost:5001/api/articles?flag=breaking&lang=en
```

Should return breaking news articles.

### Test Category:
```bash
curl http://localhost:5001/api/categories/india?lang=en
```

Should return articles for India category.

### Test Home Feed:
```bash
curl http://localhost:5001/api/home?lang=en
```

Should return data for all sections.

---

## 📊 Expected Results

After running seed + scraping:

### Breaking News:
- ✅ 15+ articles marked as breaking
- ✅ Appears in ticker at top
- ✅ Updates dynamically

### Categories:
- ✅ **India**: 5+ articles
- ✅ **World**: 5+ articles
- ✅ **Business**: 5+ articles
- ✅ **Markets**: 5+ articles
- ✅ **Tech**: 5+ articles
- ✅ **Sports**: 5+ articles
- ✅ **Entertainment**: 5+ articles
- ✅ **Lifestyle**: 5+ articles
- ✅ **Opinion**: 5+ articles

### All Sections:
- ✅ Hero: Featured articles
- ✅ Latest: Recent articles
- ✅ Trending: Popular articles
- ✅ Category sections: Articles per category

---

## 🐛 Troubleshooting

### If breaking news not showing:

1. **Check if breaking articles exist:**
   ```bash
   # MongoDB
   db.articles.find({ 'flags.isBreaking': true }).limit(5)
   ```

2. **Check API response:**
   ```bash
   curl http://localhost:5001/api/articles?flag=breaking&lang=en
   ```

3. **Verify frontend is calling correct endpoint:**
   - Check browser Network tab
   - Should see: `/api/articles?flag=breaking&lang=te` or `lang=en`

### If categories are empty:

1. **Check if articles exist in categories:**
   ```bash
   # MongoDB - check India category
   db.articles.find({ 
     status: 'published',
     category: ObjectId('...') // Your India category ID
   }).limit(5)
   ```

2. **Re-run seed script:**
   ```bash
   npm run seed
   ```

3. **Trigger scraping:**
   ```bash
   npm run scrape
   ```

### If scraping fails:

1. **Check backend logs** for RSS feed errors
2. **Some feeds may fail** - this is normal, system continues with others
3. **Seed articles will still show** even if scraping fails

---

## ✅ Quick Fix Commands

Run these in order:

```bash
# 1. Re-seed database (creates base articles)
cd backend
npm run seed

# 2. Trigger scraping (gets real news)
npm run scrape

# 3. Restart backend
npm run dev

# 4. Refresh frontend
# Open http://localhost:5174
```

---

## 🎉 Result

After these steps:
- ✅ **Breaking news** displays in ticker
- ✅ **All categories** show articles
- ✅ **All sections** have content
- ✅ **Dynamic updates** every 30 minutes
- ✅ **Professional display** throughout

**Your news website will be fully functional with dynamic content!** 🚀


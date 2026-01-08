import { connectDb } from '../config/db.js';
import { ArticleModel } from '../models/article.model.js';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Import the extractImage function from newsAggregator service
const extractImage = async (link) => {
  try {
    const response = await axios.get(link, { 
      timeout: 10000,
      maxRedirects: 5,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });
    const $ = cheerio.load(response.data);
    
    // Priority 1: Open Graph and Twitter Card images (most reliable)
    let image = $('meta[property="og:image"]').attr('content') ||
                $('meta[name="og:image"]').attr('content') ||
                $('meta[property="twitter:image"]').attr('content') ||
                $('meta[name="twitter:image"]').attr('content') ||
                $('meta[name="twitter:image:src"]').attr('content') ||
                $('meta[property="og:image:secure_url"]').attr('content') ||
                $('link[rel="image_src"]').attr('href');
    
    // Priority 2: Article-specific image selectors
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
    
    // Priority 3: Look for images with specific attributes indicating they're article images
    if (!image) {
      $('img').each((i, elem) => {
        const $img = $(elem);
        const src = $img.attr('src') || $img.attr('data-src') || $img.attr('data-lazy-src') || $img.attr('data-original');
        if (!src) return;
        
        // Skip small images, icons, logos, avatars
        const width = parseInt($img.attr('width') || $img.attr('data-width') || '0');
        const height = parseInt($img.attr('height') || $img.attr('data-height') || '0');
        const className = ($img.attr('class') || '').toLowerCase();
        const alt = ($img.attr('alt') || '').toLowerCase();
        
        // Skip if it's likely an icon/logo/avatar
        if (className.includes('icon') || className.includes('logo') || className.includes('avatar') || 
            alt.includes('logo') || alt.includes('icon') || width < 300 || height < 200) {
          return;
        }
        
        // Prefer larger images
        if (width > 400 || height > 300 || !width || !height) {
          image = src;
          return false; // break
        }
      });
    }
    
    // Priority 4: First large image in main content area
    if (!image) {
      const contentSelectors = [
        'main img',
        '.content img',
        '.entry-content img',
        '.post-content img',
        '.article-content img',
        '[role="main"] img'
      ];
      
      for (const selector of contentSelectors) {
        const imgs = $(selector);
        if (imgs.length) {
          imgs.each((i, elem) => {
            const $img = $(elem);
            const src = $img.attr('src') || $img.attr('data-src') || $img.attr('data-lazy-src');
            if (src) {
              const width = parseInt($img.attr('width') || '0');
              if (width > 300 || !width) {
                image = src;
                return false; // break
              }
            }
          });
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
          const url = new URL(link);
          image = `${url.protocol}//${url.host}${image}`;
        } catch {
          return null;
        }
      } else if (!image.startsWith('http')) {
        return null;
      }
      
      // Remove query parameters that might break the URL
      image = image.split('?')[0];
      
      // Validate it's actually an image URL - exclude placeholder services
      const placeholderServices = [
        'picsum.photos',
        'via.placeholder.com',
        'placeholder.com',
        'placehold.it',
        'dummyimage.com',
        'fakeimg.pl',
        'placehold.co'
      ];
      
      const isPlaceholder = placeholderServices.some(service => image.includes(service));
      if (isPlaceholder) {
        return null; // Don't use placeholder images
      }
      
      // Accept image URLs with extensions or from known image CDNs
      if (image.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?|$)/i) || 
          image.includes('googleusercontent.com') ||
          image.includes('imgur.com') ||
          image.includes('cloudinary.com') ||
          image.includes('cdn') ||
          image.includes('images') ||
          image.match(/\/image\//) ||
          image.match(/\/photo\//) ||
          image.match(/\/img\//) ||
          image.match(/\/media\//) ||
          image.match(/\/uploads\//) ||
          image.match(/\/wp-content\//)) {
        return image;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error extracting image from ${link}:`, error.message);
    return null;
  }
};

const updateArticleImages = async () => {
  try {
    await connectDb();
    console.log('✅ Connected to database');
    
    // Find all published articles without images or with placeholder images
    const articles = await ArticleModel.find({
      status: 'published',
      $or: [
        { heroImage: { $exists: false } },
        { heroImage: null },
        { heroImage: '' },
        { heroImage: { $regex: /placeholder|picsum|dummyimage/i } }
      ],
      sourceUrl: { $exists: true, $ne: null }
    }).limit(100); // Process in batches
    
    console.log(`Found ${articles.length} articles without real images`);
    
    let updated = 0;
    let skipped = 0;
    let failed = 0;
    
    for (const article of articles) {
      try {
        if (!article.sourceUrl) {
          console.log(`⏭️  Skipping ${article.title.substring(0, 50)} - no source URL`);
          skipped++;
          continue;
        }
        
        console.log(`\n📰 Processing: ${article.title.substring(0, 60)}...`);
        console.log(`   Source: ${article.sourceUrl}`);
        
        // Extract image from source URL
        let extractedImage = await extractImage(article.sourceUrl);
        
        // If that fails and it's a Google News URL, try to extract actual URL
        if (!extractedImage && article.sourceUrl.includes('news.google.com')) {
          const googleThumbMatch = article.sourceUrl.match(/url=([^&]+)/);
          if (googleThumbMatch) {
            try {
              const actualUrl = decodeURIComponent(googleThumbMatch[1]);
              console.log(`   Trying actual URL: ${actualUrl.substring(0, 80)}...`);
              extractedImage = await extractImage(actualUrl);
            } catch {
              console.log(`   ⚠️  Could not decode Google News URL`);
            }
          }
        }
        
        // Validate it's not a placeholder
        if (extractedImage) {
          const placeholderServices = ['picsum.photos', 'via.placeholder.com', 'placeholder.com', 'placehold.it', 'dummyimage.com', 'placehold.co'];
          const isPlaceholder = placeholderServices.some(service => extractedImage.includes(service));
          
          if (isPlaceholder) {
            console.log(`   ❌ Rejected placeholder image`);
            extractedImage = null;
          }
        }
        
        if (extractedImage) {
          await ArticleModel.findByIdAndUpdate(article._id, {
            $set: { heroImage: extractedImage }
          });
          console.log(`   ✅ Updated with image: ${extractedImage.substring(0, 80)}...`);
          updated++;
        } else {
          console.log(`   ⚠️  No real image found - keeping article without image`);
          skipped++;
        }
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`   ❌ Error processing article:`, error.message);
        failed++;
      }
    }
    
    console.log(`\n\n📊 Summary:`);
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`\n✅ Image update complete!`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
};

updateArticleImages();


import { aggregateNews, aggregateAllNews } from '../services/newsAggregator.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../middleware/errorHandler.js';

/**
 * Aggregate news for a specific language
 */
export const aggregateNewsByLanguage = asyncHandler(async (req, res) => {
  const { language } = req.params;
  
  if (!['en', 'te'].includes(language)) {
    throw new ApiError(400, 'Invalid language. Supported languages: en, te');
  }
  
  const result = await aggregateNews(language);
  
  res.json({
    success: true,
    message: `News aggregation completed for ${language}`,
    result
  });
});

/**
 * Aggregate news for all languages
 */
export const aggregateAllNewsHandler = asyncHandler(async (req, res) => {
  const results = await aggregateAllNews();
  
  res.json({
    success: true,
    message: 'News aggregation completed for all languages',
    results
  });
});

/**
 * Get aggregation status
 */
export const getAggregationStatus = asyncHandler(async (req, res) => {
  const { ArticleModel } = await import('../models/article.model.js');
  
  const stats = {
    total: await ArticleModel.countDocuments({ isAggregated: true }),
    telugu: await ArticleModel.countDocuments({ isAggregated: true, language: 'te' }),
    english: await ArticleModel.countDocuments({ isAggregated: true, language: 'en' }),
    nellore: await ArticleModel.countDocuments({ 
      isAggregated: true,
      'location.city': 'Nellore'
    })
  };
  
  res.json({
    success: true,
    stats
  });
});



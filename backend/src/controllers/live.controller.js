import { LiveService } from '../services/live.service.js';
import { ApiError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getLiveBlog = asyncHandler(async (req, res) => {
  const blog = await LiveService.getBySlug(req.params.slug);
  if (!blog) {
    throw new ApiError(404, 'Live blog not found');
  }

  res.json({
    id: blog._id.toString(),
    slug: blog.slug,
    title: blog.title,
    summary: blog.summary,
    status: blog.status,
    entries: blog.entries.map((entry) => ({
      id: entry._id.toString(),
      timestamp: entry.timestamp,
      content: entry.content,
      mediaUrl: entry.mediaUrl
    }))
  });
});

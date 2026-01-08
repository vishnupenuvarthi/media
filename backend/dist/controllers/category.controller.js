import { CategoryService } from '../services/category.service.js';
import { ArticleService } from '../services/article.service.js';
import { ApiError } from '../middleware/errorHandler.js';
export const getCategory = async (req, res) => {
    const category = await CategoryService.getBySlug(req.params.slug);
    if (!category) {
        throw new ApiError(404, 'Category not found');
    }
    const stories = await ArticleService.listByCategory(category._id);
    res.json({
        category: {
            id: category._id.toString(),
            title: category.title,
            slug: category.slug,
            description: category.description,
            heroImage: category.heroImage
        },
        featured: stories[0],
        latest: stories.slice(1, 7),
        relatedTags: Array.from(new Set(stories.flatMap((story) => story.tags))).slice(0, 10)
    });
};

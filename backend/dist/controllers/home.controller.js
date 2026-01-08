import { ArticleService } from '../services/article.service.js';
import { CategoryService } from '../services/category.service.js';
const formatHeadline = (article) => ({
    id: article._id.toString(),
    title: article.title,
    slug: article.slug,
    category: article.category?.title ?? 'News',
    publishedAt: article.publishedAt ?? article.updatedAt
});
export const getHomeFeed = async (_req, res) => {
    const [hero, sections, latest, trending] = await Promise.all([
        ArticleService.listHero(),
        CategoryService.listAll(),
        ArticleService.listLatest(),
        ArticleService.listTrending()
    ]);
    const heroFormatted = hero.map((article) => ({
        id: article._id.toString(),
        title: article.title,
        slug: article.slug,
        category: article.category?.title ?? 'News',
        summary: article.summary,
        heroImage: article.heroImage,
        author: { name: article.author?.profile?.name ?? 'Staff' },
        publishedAt: article.publishedAt ?? article.updatedAt
    }));
    const sectionPayload = sections.map((category) => ({
        category: {
            id: category._id.toString(),
            title: category.title,
            slug: category.slug,
            description: category.description
        },
        stories: hero
            .filter((article) => article.category?._id?.equals(category._id))
            .slice(0, 4)
            .map(formatHeadline)
    }));
    res.json({
        hero: heroFormatted,
        sections: sectionPayload,
        latest: latest.map(formatHeadline),
        trending: trending.map(formatHeadline),
        videos: heroFormatted,
        photos: latest.map(formatHeadline)
    });
};

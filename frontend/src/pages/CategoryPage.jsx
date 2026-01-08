import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translate, translateCategory } from '@/utils/translator';
import dayjs from '@/utils/dayjs';

export const CategoryPage = () => {
  const { slug, tag } = useParams();
  const language = useLanguageStore((state) => state.language);
  const t = (key) => translate(language, `pages.category.${key}`);
  
  // Determine if this is a tag-based route or regular category
  const isTagRoute = !!tag;
  const identifier = tag || slug || '';
  const apiPath = isTagRoute 
    ? `/categories/tag/${tag}?lang=${language}` 
    : `/categories/${slug}?lang=${language}`;
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['category', isTagRoute ? `tag-${tag}` : slug, language],
    queryFn: async () => {
      const { data } = await api.get(apiPath);
      return data;
    },
    enabled: !!identifier
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded-xl" />
          <div className="grid md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data || !data.category) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-serif mb-2">{t('notFound') || 'Category Not Found'}</h2>
          <p className="text-gray-600 mb-4">
            {isTagRoute 
              ? `${t('noTagArticles') || `No articles found for "${tag}"`}.`
              : `${t('noCategoryArticles') || `The category "${slug}" could not be found or has no articles`}.`
            }
          </p>
          <Link to="/" className="text-primary font-semibold hover:underline">
            {t('backToHome') || '← Back to Home'}
          </Link>
        </div>
      </div>
    );
  }

  const allStories = data.featured ? [data.featured, ...(data.latest || [])] : (data.latest || []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      <header className="space-y-3 border-b border-gray-200 pb-6">
        <p className="text-xs uppercase tracking-[0.5em] text-primary">{translateCategory(language, data.category.title)}</p>
        <h1 className="text-4xl font-serif">{translateCategory(language, data.category.title)}</h1>
        <p className="text-gray-600 text-lg">{translateCategory(language, data.category.description)}</p>
      </header>

      {data.featured && (
        <article className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <Link to={`/article/${data.featured.slug}`} className="group">
            <div className="grid md:grid-cols-[1.5fr_1fr] gap-6">
              <div className="overflow-hidden rounded-xl bg-gray-100">
                {data.featured.heroImage ? (
                  <img
                    src={data.featured.heroImage}
                    alt={data.featured.title}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/800x400/4A5568/FFFFFF?text=News';
                    }}
                  />
                ) : (
                  <div className="w-full h-80 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-gray-400">No Image Available</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <p className="text-xs uppercase tracking-[0.4em] text-primary">Featured Story</p>
                <h2 className="text-3xl font-serif font-bold leading-tight group-hover:text-primary transition">
                  {data.featured.title}
                </h2>
                {data.featured.summary && (
                  <p className="text-gray-600 line-clamp-4">{data.featured.summary}</p>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <time>{dayjs(data.featured.publishedAt).format('MMM D, YYYY · h:mm A')}</time>
                </div>
              </div>
            </div>
          </Link>
        </article>
      )}

      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <div>
            <h2 className="text-2xl font-serif font-bold">{t('latestArticles') || 'Latest Articles'}</h2>
            <p className="text-sm text-gray-500 mt-1">{t('showingResults') || `Showing ${allStories.length} ${allStories.length === 1 ? 'article' : 'articles'}`}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
              {language === 'en' ? 'English' : 'తెలుగు'}
            </span>
          </div>
        </div>
        
        {data.latest && data.latest.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.latest.map((story) => (
              <Link 
                key={story.id} 
                to={`/article/${story.slug}`} 
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden"
              >
                <div className="overflow-hidden bg-gray-100">
                  {story.heroImage ? (
                    <img
                      src={story.heroImage}
                      alt={story.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300/4A5568/FFFFFF?text=News';
                      }}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-xs uppercase tracking-[0.4em] text-gray-400">
                    {translateCategory(language, story.category)}
                  </p>
                  <h3 className="font-serif font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition">
                    {story.title}
                  </h3>
                  {story.summary && (
                    <p className="text-sm text-gray-600 line-clamp-2">{story.summary}</p>
                  )}
                  <time className="text-xs text-gray-500 block">
                    {dayjs(story.publishedAt).format('MMM D, YYYY')}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-12 text-center">
            <p className="text-gray-500">No articles found in this category.</p>
          </div>
        )}
      </section>

      {data.relatedTags && data.relatedTags.length > 0 && (
        <section className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold mb-4 text-lg">Related Tags</h3>
          <div className="flex flex-wrap gap-2">
            {data.relatedTags.map((tag) => (
              <span 
                key={tag} 
                className="px-4 py-2 bg-white rounded-full text-sm border border-gray-200 hover:border-primary hover:text-primary transition cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};


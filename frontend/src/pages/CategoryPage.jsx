import { useParams, Link } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translate, translateCategory } from '@/utils/translator';
import dayjs from '@/utils/dayjs';
import { CalendarPDFViewer } from '@/components/home/CalendarPDFViewer';

export const CategoryPage = () => {
  const { slug, tag } = useParams();
  const language = useLanguageStore((state) => state.language);
  const t = (key) => translate(language, `pages.category.${key}`);

  // For calendar category, skip article fetching and show only PDFs
  const isCalendarCategory = slug === 'calendar' || slug === 'nlr-news-calendar' || slug?.toLowerCase().includes('calendar');

  // Determine if this is a tag-based route or regular category
  const isTagRoute = !!tag;
  const identifier = tag || slug || '';

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['category', isTagRoute ? `tag-${tag}` : slug, language],
    queryFn: async ({ pageParam = 1 }) => {
      const endpoint = isTagRoute
        ? `/categories/tag/${tag}`
        : `/categories/${slug}`;
      const { data } = await api.get(endpoint, {
        params: {
          lang: language,
          page: pageParam,
          limit: 12 // Reduced for faster initial load
        }
      });
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      // Backend returns pagination.hasMore or check list length
      if (lastPage.pagination?.hasMore) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    enabled: !!identifier && !isCalendarCategory,
    staleTime: 5 * 60 * 1000 // Cache for 5 minutes
  });

  if (isCalendarCategory) {
    return (
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 space-y-4">
        <header className="space-y-2 border-b border-gray-200 pb-2 sm:pb-3 text-center sm:text-left">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] sm:tracking-[0.5em] text-primary font-bold">Calendar</p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold">NLR NEWS CALENDAR</h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">View and download important dates and schedules</p>
        </header>
        <CalendarPDFViewer />
      </div>
    );
  }

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

  // Check if first page has error or no data
  const firstPage = data?.pages[0];
  if (isError || !firstPage || !firstPage.category) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center shadow-sm">
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

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12 space-y-8 lg:space-y-12">
      {/* Header */}
      <header className="space-y-3 border-b border-gray-200 pb-4 sm:pb-6 text-center sm:text-left">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] sm:tracking-[0.5em] text-primary font-bold">
          {translateCategory(language, firstPage.category.title)}
        </p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-gray-900">
          {translateCategory(language, firstPage.category.title)}
        </h1>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto sm:mx-0">
          {translateCategory(language, firstPage.category.description)}
        </p>
      </header>

      {/* Featured Story (Only from first page) */}
      {firstPage.featured && !isTagRoute && (
        <article className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <Link to={`/article/${firstPage.featured.slug}`} className="group block">
            <div className="grid md:grid-cols-[1.5fr_1fr] gap-6">
              <div className="overflow-hidden rounded-lg sm:rounded-xl bg-gray-100 aspect-video md:aspect-auto h-full">
                {firstPage.featured.heroImage ? (
                  <img
                    src={firstPage.featured.heroImage}
                    alt={firstPage.featured.title}
                    loading="eager"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/800x400?text=News';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No Image</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center space-y-3 sm:space-y-4">
                <span className="inline-block px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded uppercase tracking-wider w-fit">
                  Featured
                </span>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold leading-tight group-hover:text-primary transition-colors">
                  {firstPage.featured.title}
                </h2>
                {firstPage.featured.summary && (
                  <p className="text-sm sm:text-base text-gray-600 line-clamp-3 sm:line-clamp-4 leading-relaxed">
                    {firstPage.featured.summary}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 pt-2">
                  <time>{dayjs(firstPage.featured.publishedAt).format('MMM D, YYYY · h:mm A')}</time>
                </div>
              </div>
            </div>
          </Link>
        </article>
      )}

      {/* Latest Articles Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <h2 className="text-lg sm:text-xl font-serif font-bold flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            {t('latestArticles') || 'Latest Articles'}
          </h2>
          <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">
            {data.pages.reduce((acc, page) => acc + page.latest.length, 0) + (firstPage.featured ? 1 : 0)} Stories
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {data.pages.map((group, i) => (
            group.latest.map((story) => (
              <Link
                key={`${story.id}-${i}`}
                to={`/article/${story.slug}`}
                className="flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden h-full"
              >
                <div className="aspect-[16/9] overflow-hidden bg-gray-100 relative">
                  {story.heroImage ? (
                    <img
                      src={story.heroImage}
                      alt={story.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=News';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                  {story.category && (
                    <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">
                      {translateCategory(language, story.category)}
                    </span>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-grow space-y-3">
                  <h3 className="font-serif font-bold text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {story.title}
                  </h3>
                  {story.summary && (
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed flex-grow">
                      {story.summary}
                    </p>
                  )}
                  <div className="pt-3 mt-auto border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                    <time>{dayjs(story.publishedAt).fromNow()}</time>
                    <span className="group-hover:translate-x-1 transition-transform text-primary font-semibold">Read →</span>
                  </div>
                </div>
              </Link>
            ))
          ))}
        </div>

        {/* Load More Button */}
        {hasNextPage && (
          <div className="flex justify-center pt-8 pb-4">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-8 py-3 bg-white border-2 border-primary/20 text-primary font-bold rounded-full hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {isFetchingNextPage ? 'Loading Stories...' : 'Load More Articles'}
            </button>
          </div>
        )}

        {!hasNextPage && data.pages.length > 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            You've reached the end of the list.
          </div>
        )}
      </section>

      {/* Related Tags */}
      {firstPage.relatedTags && firstPage.relatedTags.length > 0 && (
        <section className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-500">Related Topics</h3>
          <div className="flex flex-wrap gap-2">
            {firstPage.relatedTags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 bg-white rounded-full text-xs sm:text-sm border border-gray-200 hover:border-primary hover:text-primary transition-colors cursor-pointer font-medium shadow-sm"
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

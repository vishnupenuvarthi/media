import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translate, translateCategory } from '@/utils/translator';
import dayjs from '@/utils/dayjs';
import { MegaphoneIcon } from '@heroicons/react/24/solid';

export const BreakingNewsPage = () => {
  const language = useLanguageStore((state) => state.language);
  const t = (key) => translate(language, `breaking.${key}`);

  const { data: articles, isLoading, error } = useQuery({
    queryKey: ['breaking-news', language],
    queryFn: async () => {
      const { data } = await api.get(`/articles?flag=breaking&lang=${language}`);
      return data || [];
    }
  });

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-red-900/30 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
          <div className="h-16 bg-gray-700/50 rounded w-1/4 mb-8" />
          <div className="h-12 bg-gray-700/30 rounded" />
        </div>
      </div>
    );
  }

  if (error || !articles || articles.length === 0) {
    return (
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-red-900/30 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center gap-2 text-yellow-400 mb-4">
            <MegaphoneIcon className="w-5 h-5 text-yellow-400" />
            <span className="text-lg font-bold uppercase tracking-wider">{t('label') || 'BREAKING NEWS'}</span>
          </div>
          <h2 className="text-3xl font-serif mb-4 text-white">{t('noNews') || 'No Breaking News'}</h2>
          <p className="text-gray-300 mb-6">{t('noNewsDesc') || 'There are no breaking news stories at the moment.'}</p>
          <Link to="/" className="px-6 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 transition font-semibold">
            {t('backToHome') || 'Back to Home'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-red-900/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Professional Horizontal Breaking News Ticker */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-red-900/40 shadow-2xl border-b-2 border-yellow-400/30 overflow-hidden mb-4 sm:mb-6 lg:mb-8 rounded-lg sm:rounded-xl">
          <div className="flex items-center min-h-[50px] sm:min-h-[60px]">
            {/* BREAKING NEWS Label */}
            <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2 bg-gray-900/80 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-yellow-400 font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm whitespace-nowrap border-r border-gray-700">
              <MegaphoneIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <span className="hidden sm:inline">{t('label') || 'BREAKING NEWS'}</span>
              <span className="sm:hidden">BREAKING</span>
            </div>

            {/* Horizontal Headlines - Evenly Spaced */}
            <div className="flex-1 flex items-center overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style>{`
                .breaking-news-scroll::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              <div className="flex items-center h-full breaking-news-scroll">
                {articles.map((article, index) => (
                  <Link
                    key={article.id}
                    to={`/article/${article.slug}`}
                    className="group flex-shrink-0 flex items-center h-full px-3 sm:px-4 lg:px-6 hover:bg-gray-800/30 transition-colors"
                  >
                    <span className="text-white text-xs sm:text-sm font-medium whitespace-nowrap group-hover:text-yellow-300 transition-colors">
                      {article.title}
                    </span>
                    {index < articles.length - 1 && (
                      <span className="h-4 sm:h-5 w-px bg-gray-600/50 mx-3 sm:mx-4 lg:mx-6 flex-shrink-0" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Breaking News Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={`/article/${article.slug}`}
              className="group bg-white/10 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:bg-white/20 hover:border-yellow-400/50 transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-40 sm:h-48 lg:h-56 overflow-hidden bg-gray-100">
                {article.heroImage ? (
                  <>
                    <img
                      src={article.heroImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300/4A5568/FFFFFF?text=Breaking+News';
                      }}
                    />
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 sm:px-3 py-0.5 sm:py-1 bg-red-600 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wide rounded">
                      Breaking
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-gray-400 text-xs sm:text-sm">No Image</span>
                  </div>
                )}
              </div>
              <div className="p-3 sm:p-4 lg:p-5">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 flex-wrap">
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-yellow-400 font-semibold">
                    {translateCategory(language, article.category)}
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-400 hidden sm:inline">·</span>
                  <time className="text-[10px] sm:text-xs text-gray-400">
                    {dayjs(article.publishedAt).format('MMM D, h:mm A')}
                  </time>
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold leading-tight text-white group-hover:text-yellow-300 transition mb-2 line-clamp-2">
                  {article.title}
                </h3>
                {article.summary && (
                  <p className="text-xs sm:text-sm text-gray-300 line-clamp-2">{article.summary}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};


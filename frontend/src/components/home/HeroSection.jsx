import { Link } from 'react-router-dom';
import dayjs from '@/utils/dayjs';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translate, translateCategory } from '@/utils/translator';

export const HeroSection = ({ stories = [] }) => {
  if (!stories?.length) return null;

  const main = stories[0];
  const highlights = stories.slice(1, 4);
  const quick = stories.slice(4, 8);
  const language = useLanguageStore((state) => state.language);

  return (
    <section className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8">
      <div className="grid lg:grid-cols-[2fr_1fr] gap-4 sm:gap-6">
        <article className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-newsroom group cursor-pointer">
          <Link to={`/article/${main.slug}`}>
            {main.heroImage ? (
              <img
                src={main.heroImage}
                alt={main.title}
                className="w-full h-[280px] sm:h-[360px] lg:h-[460px] object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/1200x600/4A5568/FFFFFF?text=News';
                }}
              />
            ) : (
              <div className="w-full h-[280px] sm:h-[360px] lg:h-[460px] bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                <span className="text-gray-500 text-sm sm:text-lg">No Image Available</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            <div className="absolute bottom-0 p-4 sm:p-6 lg:p-8 text-white space-y-2 sm:space-y-4">
              <span className="inline-flex items-center text-[10px] sm:text-[11px] font-cond tracking-[0.3em] sm:tracking-[0.4em] uppercase px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                {translateCategory(language, main.category)}
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-4xl font-serif font-bold leading-tight group-hover:text-accent transition line-clamp-2 sm:line-clamp-none">
                {main.title}
              </h2>
              <p className="text-xs sm:text-sm text-white/90 max-w-3xl line-clamp-2 hidden sm:block">{main.summary}</p>
              <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-white/70 flex-wrap">
                <span className="uppercase tracking-[0.2em] sm:tracking-[0.3em] truncate">{main.author?.name ?? 'News Desk'}</span>
                <span className="hidden sm:inline">·</span>
                <time className="whitespace-nowrap">{dayjs(main.publishedAt).format('MMM D, h:mm a')}</time>
              </div>
            </div>
          </Link>
        </article>

        <div className="bg-card-muted rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 flex flex-col gap-3 sm:gap-4 lg:gap-5">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] sm:tracking-[0.5em] text-gray-500">{translate(language, 'hero.editorsPick')}</p>
          {highlights.map((story) => (
            <Link
              key={story.id}
              to={`/article/${story.slug}`}
              className="flex gap-2 sm:gap-3 lg:gap-4 pb-3 sm:pb-4 border-b border-gray-200 last:border-none hover:opacity-90 transition"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {story.heroImage ? (
                  <img
                    src={story.heroImage}
                    alt={story.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/200x200/4A5568/FFFFFF?text=News';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-gray-400 text-[10px] sm:text-xs">No Image</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs text-primary uppercase tracking-[0.3em] sm:tracking-[0.4em] truncate">{translateCategory(language, story.category)}</p>
                <h3 className="font-serif font-semibold text-sm sm:text-base lg:text-lg leading-snug line-clamp-2 sm:line-clamp-none">{story.title}</h3>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">{dayjs(story.publishedAt).fromNow()}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {!!quick.length && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {quick.map((story) => (
            <Link
              key={story.id}
              to={`/article/${story.slug}`}
              className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200 hover:-translate-y-1 transition shadow-sm"
            >
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-gray-400 line-clamp-1">{translateCategory(language, story.category)}</p>
              <h4 className="font-serif font-semibold text-sm sm:text-base lg:text-lg mt-1 sm:mt-2 line-clamp-2 sm:line-clamp-3">{story.title}</h4>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-2 sm:mt-3">{dayjs(story.publishedAt).format('MMM D')}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};


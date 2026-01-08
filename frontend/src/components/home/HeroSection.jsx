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
    <section className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        <article className="relative rounded-2xl overflow-hidden shadow-newsroom group cursor-pointer">
          <Link to={`/article/${main.slug}`}>
            <img
              src={main.heroImage || 'https://via.placeholder.com/1200x600/4A5568/FFFFFF?text=News'}
              alt={main.title}
              className="w-full h-[460px] object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/1200x600/4A5568/FFFFFF?text=News';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            <div className="absolute bottom-0 p-8 text-white space-y-4">
              <span className="inline-flex items-center text-[11px] font-cond tracking-[0.4em] uppercase px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                {translateCategory(language, main.category)}
              </span>
              <h2 className="text-4xl font-serif font-bold leading-tight group-hover:text-accent transition">
                {main.title}
              </h2>
              <p className="text-sm text-white/90 max-w-3xl line-clamp-2">{main.summary}</p>
              <div className="flex items-center gap-3 text-xs text-white/70">
                <span className="uppercase tracking-[0.3em]">{main.author?.name ?? 'News Desk'}</span>
                <span>·</span>
                <time>{dayjs(main.publishedAt).format('MMM D, h:mm a')}</time>
              </div>
            </div>
          </Link>
        </article>

        <div className="bg-card-muted rounded-2xl p-5 flex flex-col gap-5">
          <p className="text-xs uppercase tracking-[0.5em] text-gray-500">{translate(language, 'hero.editorsPick')}</p>
          {highlights.map((story) => (
            <Link
              key={story.id}
              to={`/article/${story.slug}`}
              className="flex gap-4 pb-4 border-b border-gray-200 last:border-none hover:opacity-90 transition"
            >
              <img
                src={story.heroImage || 'https://via.placeholder.com/200x200/4A5568/FFFFFF?text=News'}
                alt={story.title}
                className="w-24 h-24 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/200x200/4A5568/FFFFFF?text=News';
                }}
              />
              <div className="flex-1">
                <p className="text-xs text-primary uppercase tracking-[0.4em]">{translateCategory(language, story.category)}</p>
                <h3 className="font-serif font-semibold text-lg leading-snug">{story.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{dayjs(story.publishedAt).fromNow()}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {!!quick.length && (
        <div className="grid md:grid-cols-4 gap-4">
          {quick.map((story) => (
            <Link
              key={story.id}
              to={`/article/${story.slug}`}
              className="bg-white p-4 rounded-xl border border-gray-200 hover:-translate-y-1 transition shadow-sm"
            >
              <p className="text-[11px] uppercase tracking-[0.4em] text-gray-400">{translateCategory(language, story.category)}</p>
              <h4 className="font-serif font-semibold text-lg mt-2 line-clamp-3">{story.title}</h4>
              <p className="text-xs text-gray-500 mt-3">{dayjs(story.publishedAt).format('MMM D')}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};


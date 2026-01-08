import { Link } from 'react-router-dom';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translate, translateCategory } from '@/utils/translator';

export const VideoRail = ({ stories = [] }) => {
  if (!stories?.length) return null;
  const [featured, ...rest] = stories;
  const language = useLanguageStore((state) => state.language);

  return (
    <section className="bg-secondary text-white rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-white/50">{translate(language, 'hero.videoTitle')}</p>
          <h2 className="text-3xl font-serif">{translate(language, 'video.title')}</h2>
        </div>
        <Link to="/videos" className="text-xs uppercase tracking-[0.5em]">
          {translate(language, 'video.seeAll')}
        </Link>
      </div>
      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        <article className="relative rounded-xl overflow-hidden group cursor-pointer">
          <img
            src={featured.heroImage || 'https://via.placeholder.com/1200x600/1A202C/FFFFFF?text=Video'}
            alt={featured.title}
            className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/1200x600/1A202C/FFFFFF?text=Video';
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-0 p-6 space-y-3">
            <p className="text-xs uppercase tracking-[0.5em] text-white/70">{translateCategory(language, featured.category)}</p>
            <Link to={`/article/${featured.slug}`} className="text-3xl font-serif font-semibold leading-tight">
              {featured.title}
            </Link>
            <p className="text-sm text-white/70">{featured.summary}</p>
          </div>
        </article>

        <div className="space-y-3">
          {rest.map((story) => (
            <Link
              key={story.id}
              to={`/article/${story.slug}`}
              className="flex gap-3 bg-white/5 rounded-xl p-3 hover:bg-white/10 transition"
            >
              <div className="w-24 h-16 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                {story.heroImage && (
                  <img
                    src={story.heroImage}
                    alt={story.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/200x150/1A202C/FFFFFF?text=Video';
                    }}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] uppercase tracking-[0.4em] text-white/60">{translateCategory(language, story.category)}</p>
                <p className="font-semibold line-clamp-2">{story.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};


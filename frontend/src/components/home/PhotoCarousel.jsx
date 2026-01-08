import { Link } from 'react-router-dom';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translate } from '@/utils/translator';

export const PhotoCarousel = ({ stories = [] }) => {
  if (!stories?.length) return null;
  const language = useLanguageStore((state) => state.language);

  return (
    <section className="bg-card-muted rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-gray-500">{translate(language, 'photo.title')}</p>
          <h2 className="text-3xl font-serif">{translate(language, 'photo.title')}</h2>
        </div>
        <Link to="/photos" className="text-sm text-primary font-semibold">
          {translate(language, 'photo.viewAll')}
        </Link>
      </div>
      <div className="grid md:grid-cols-4 gap-4">
        {stories.map((story) => (
          <Link key={story.id} to={`/article/${story.slug}`} className="space-y-2 group">
            <div className="h-48 rounded-2xl overflow-hidden bg-black/10">
              <img
                src={story.heroImage || 'https://via.placeholder.com/400x300/4A5568/FFFFFF?text=Photo'}
                alt={story.title}
                className="w-full h-full object-cover group-hover:scale-105 transition"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400x300/4A5568/FFFFFF?text=Photo';
                }}
              />
            </div>
            <h3 className="text-sm font-semibold leading-tight">{story.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
};


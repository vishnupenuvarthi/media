import { Link } from 'react-router-dom';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translate, translateCategory } from '@/utils/translator';

export const TrendingSidebar = ({ stories = [] }) => {
  const language = useLanguageStore((state) => state.language);

  return (
    <aside className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-fit sticky top-32 space-y-5">
      <div>
        <p className="text-xs uppercase tracking-[0.5em] text-gray-500">{translate(language, 'trending.label')}</p>
        <h3 className="text-2xl font-serif">{translate(language, 'trending.title')}</h3>
      </div>
      {stories.length > 0 ? (
        <ol className="space-y-4">
          {stories.slice(0, 10).map((story, index) => (
            <li key={story.id} className="flex gap-3 items-start group">
              <span className={`text-2xl font-cond leading-none flex-shrink-0 ${
                index < 3 ? 'text-primary font-bold' : 'text-gray-300'
              }`}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <Link 
                  to={`/article/${story.slug}`} 
                  className="font-serif font-semibold hover:text-primary transition block line-clamp-2"
                >
                  {story.title}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[11px] uppercase tracking-[0.4em] text-gray-400">{translateCategory(language, story.category)}</p>
                  {story.heroImage && (
                    <img 
                      src={story.heroImage} 
                      alt="" 
                      className="w-12 h-12 object-cover rounded ml-auto opacity-0 group-hover:opacity-100 transition"
                    />
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500 italic">No trending stories at the moment.</p>
        </div>
      )}
      <div className="bg-card-muted rounded-xl p-4 text-sm text-gray-600">
        {translate(language, 'trending.description')}
      </div>
    </aside>
  );
};


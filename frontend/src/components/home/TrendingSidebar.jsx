import { Link } from 'react-router-dom';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translate, translateCategory } from '@/utils/translator';

export const TrendingSidebar = ({ stories = [] }) => {
  const language = useLanguageStore((state) => state.language);

  return (
    <aside className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-100 shadow-sm h-fit lg:sticky lg:top-32 space-y-4 sm:space-y-5">
      <div>
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] sm:tracking-[0.5em] text-gray-500">{translate(language, 'trending.label')}</p>
        <h3 className="text-xl sm:text-2xl font-serif font-bold">{translate(language, 'trending.title')}</h3>
      </div>
      {stories.length > 0 ? (
        <ol className="space-y-3 sm:space-y-4">
          {stories.slice(0, 10).map((story, index) => (
            <li key={story.id} className="flex gap-2 sm:gap-3 items-start group">
              <span className={`text-xl sm:text-2xl font-cond leading-none flex-shrink-0 ${
                index < 3 ? 'text-primary font-bold' : 'text-gray-300'
              }`}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <Link 
                  to={`/article/${story.slug}`} 
                  className="font-serif font-semibold text-sm sm:text-base hover:text-primary transition block line-clamp-2"
                >
                  {story.title}
                </Link>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-1">
                  <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-gray-400 truncate">{translateCategory(language, story.category)}</p>
                  {story.heroImage && (
                    <img 
                      src={story.heroImage} 
                      alt="" 
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded ml-auto opacity-0 group-hover:opacity-100 transition hidden sm:block"
                    />
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="text-center py-6 sm:py-8">
          <p className="text-xs sm:text-sm text-gray-500 italic">No trending stories at the moment.</p>
        </div>
      )}
      <div className="bg-card-muted rounded-lg sm:rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-gray-600">
        {translate(language, 'trending.description')}
      </div>
    </aside>
  );
};


import { Link } from 'react-router-dom';
import dayjs from '@/utils/dayjs';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translate, translateCategory } from '@/utils/translator';

export const SectionStack = ({ sections = [] }) => {
  const language = useLanguageStore((state) => state.language);

  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12">
      {sections.map((section) => {
        if (!section || !section.stories || section.stories.length === 0) {
          return null;
        }
        
        const lead = section.stories[0];
        const rest = section.stories.slice(1, 4);
        const title = translateCategory(language, section.category.title);
        const description = translateCategory(language, section.category.description ?? section.category.title);

        return (
          <article key={section.category.id} className="space-y-4">
            <header className="flex items-center justify-between border-b border-gray-200 pb-2">
              <div>
                <p className="text-xs uppercase tracking-[0.5em] text-gray-400">{title}</p>
                <h2 className="text-3xl font-serif">{description}</h2>
              </div>
              <Link to={`/category/${section.category.slug}`} className="text-primary text-sm font-semibold">
                {translate(language, 'sections.moreIn', { section: title })}
              </Link>
            </header>

            <div className="grid md:grid-cols-[1.4fr_1fr] gap-5">
              {lead && (
                <Link
                  to={`/article/${lead.slug}`}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-3"
                >
                  <div className="overflow-hidden rounded-xl bg-gray-100">
                    {lead.heroImage ? (
                      <img
                        src={lead.heroImage}
                        alt={lead.title}
                        className="w-full h-64 object-cover hover:scale-[1.02] transition"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/800x400/4A5568/FFFFFF?text=News';
                        }}
                      />
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No Image</span>
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.4em] text-gray-400">{translateCategory(language, lead.category)}</p>
                  <h3 className="font-serif text-2xl">{lead.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{lead.summary}</p>
                  <p className="text-xs text-gray-400">{dayjs(lead.publishedAt).format('MMM D · h:mm A')}</p>
                </Link>
              )}

              <div className="bg-card-muted rounded-2xl divide-y divide-gray-200">
                {rest.map((story) => (
                  <Link 
                    key={story.id} 
                    to={`/article/${story.slug}`} 
                    className="block p-4 hover:bg-white rounded-2xl transition group"
                  >
                    <div className="flex gap-3">
                      <div className="w-20 h-20 rounded-lg flex-shrink-0 overflow-hidden bg-gray-100">
                        {story.heroImage ? (
                          <img
                            src={story.heroImage}
                            alt={story.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/200x200/4A5568/FFFFFF?text=News';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] uppercase tracking-[0.4em] text-gray-400">{translateCategory(language, story.category)}</p>
                        <h4 className="font-serif font-semibold leading-snug mt-1 line-clamp-2 group-hover:text-primary transition">{story.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{dayjs(story.publishedAt).fromNow()}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};


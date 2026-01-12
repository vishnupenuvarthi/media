import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translate, translateCategory } from '@/utils/translator';

export const LatestFeed = ({ stories = [] }) => {
  const language = useLanguageStore((state) => state.language);

  return (
    <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-100 shadow-sm">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
        <div>
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] sm:tracking-[0.5em] text-gray-400">{translate(language, 'latest.label')}</p>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold">{translate(language, 'latest.heading')}</h2>
        </div>
        <Link to="/latest" className="text-primary text-xs sm:text-sm font-semibold hover:underline whitespace-nowrap">
          {translate(language, 'latest.viewTimeline')}
        </Link>
      </header>
      {stories.length > 0 ? (
        <div className="relative pl-4 sm:pl-6">
          <span className="absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/30" />
          <div className="space-y-4 sm:space-y-6">
            {stories.slice(0, 12).map((story, idx) => (
              <div key={story.id} className="relative pl-3 sm:pl-4 group">
                <span className="absolute -left-[8px] sm:-left-[10px] top-1 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-primary ring-2 ring-white group-hover:ring-primary/50 transition" />
                <Link to={`/article/${story.slug}`} className="flex gap-2 sm:gap-3 lg:gap-4 items-start hover:bg-gray-50 p-2 sm:p-3 rounded-lg -m-2 sm:-m-3 transition">
                  {story.heroImage && (
                    <img
                      src={story.heroImage}
                      alt={story.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0 opacity-0 group-hover:opacity-100 transition hidden sm:block"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                      <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-gray-400">
                        {dayjs(story.publishedAt).format('h:mm A · MMM D')}
                      </p>
                      <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded bg-primary/10 text-primary">
                        {news.map((item, _idx) => (language, story.category)}
                      </span>
                    </div>
                    <h3 className="font-serif text-base sm:text-lg lg:text-xl font-semibold group-hover:text-primary transition line-clamp-2">
                      {story.title}
                    </h3>
                    {story.summary && (
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-1">{story.summary}</p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <p className="text-xs sm:text-sm text-gray-500 italic">No latest stories available.</p>
        </div>
      )}
    </section>
  );
};


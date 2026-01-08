import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import dayjs from '@/utils/dayjs';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translate } from '@/utils/translator';

export const CalendarSection = ({ events = [] }) => {
  const language = useLanguageStore((state) => state.language);
  const t = (key) => translate(language, `calendar.${key}`);

  if (!events || events.length === 0) {
    return (
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 shadow-sm">
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-3 rounded-xl">
              <CalendarDaysIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-blue-600/70 font-bold">NLR Calendar</p>
              <h2 className="text-3xl font-serif text-gray-900">{t('heading') || 'Upcoming Events'}</h2>
            </div>
          </div>
        </header>
        <div className="text-center py-8 text-blue-700">
          <p className="text-sm">No upcoming events scheduled.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-3 rounded-xl shadow-md">
            <CalendarDaysIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-blue-600/70 font-bold">NLR Calendar</p>
            <h2 className="text-3xl font-serif text-gray-900">{t('heading') || 'Upcoming Events'}</h2>
          </div>
        </div>
      </header>
      <div className="space-y-3">
        {events.map((event) => (
          <div 
            key={event.id} 
            className="bg-white rounded-xl p-4 border-2 border-blue-100 hover:border-blue-400 hover:shadow-md transition-all duration-300"
          >
            <div className="flex gap-4 items-start">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl px-4 py-3 text-center min-w-[80px] shadow-md">
                <div className="text-xs font-semibold uppercase tracking-wide">{dayjs(event.date).format('MMM')}</div>
                <div className="text-3xl font-bold leading-none mt-1">{dayjs(event.date).format('D')}</div>
                <div className="text-xs mt-1 opacity-90">{dayjs(event.date).format('YYYY')}</div>
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                {event.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {event.category && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {event.category}
                    </span>
                  )}
                  {(event.tags || []).map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};


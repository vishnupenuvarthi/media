import { PlayCircleIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translate } from '@/utils/translator';

export const YouTubeSection = ({ videos = [] }) => {
  const language = useLanguageStore((state) => state.language);
  const t = (key) => translate(language, `youtube.${key}`);

  if (!videos || videos.length === 0) {
    return (
      <section className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <PlayCircleIcon className="w-7 h-7 text-red-600" />
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-red-600/70">NLR YouTube</p>
              <h2 className="text-3xl font-serif text-red-900">{t('heading') || 'Latest Videos'}</h2>
            </div>
          </div>
          <a
            href="https://www.youtube.com/@chinnap9430"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
          >
            View Channel <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          </a>
        </div>
        <div className="text-center py-8 text-red-700">
          <p className="text-sm">Videos will appear here once available.</p>
          <a 
            href="https://www.youtube.com/@chinnap9430" 
            target="_blank" 
            rel="noreferrer"
            className="text-red-600 hover:underline mt-2 inline-block"
          >
            Visit YouTube Channel →
          </a>
        </div>
      </section>
    );
  }

  const featured = videos[0];
  const rest = videos.slice(1, 5);

  return (
    <section className="bg-gradient-to-br from-red-50 via-white to-red-50 rounded-2xl p-6 space-y-6 border-2 border-red-200 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-3 rounded-xl">
            <PlayCircleIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-red-600/70 font-bold">NLR YouTube</p>
            <h2 className="text-3xl font-serif text-gray-900">{t('heading') || 'Latest Videos from Chinnap Channel'}</h2>
          </div>
        </div>
        <a
          href="https://www.youtube.com/@chinnap9430"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold shadow-md hover:shadow-lg"
        >
          View Channel <ArrowTopRightOnSquareIcon className="w-4 h-4" />
        </a>
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        {featured && (
          <a
            href={featured.link}
            target="_blank"
            rel="noreferrer"
            className="group block bg-black rounded-2xl overflow-hidden relative shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="relative overflow-hidden">
              <img
                src={featured.thumbnail || 'https://via.placeholder.com/640x360?text=Video'}
                alt={featured.title}
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/640x360?text=Video';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-red-600 rounded-full p-4 shadow-2xl">
                  <PlayCircleIcon className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3 text-white">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/90 backdrop-blur-sm text-xs uppercase tracking-[0.3em] font-semibold">
                <PlayCircleIcon className="w-4 h-4" />
                Latest Video
              </div>
              <h3 className="text-2xl font-serif font-bold leading-tight line-clamp-2">{featured.title}</h3>
              {featured.description && (
                <p className="text-sm text-white/80 line-clamp-2">{featured.description}</p>
              )}
            </div>
          </a>
        )}

        <div className="space-y-3">
          {rest.map((video) => (
            <a
              key={video.id}
              href={video.link}
              target="_blank"
              rel="noreferrer"
              className="group flex gap-3 bg-white rounded-xl p-3 border-2 border-gray-200 hover:border-red-500 hover:shadow-lg transition-all duration-300"
            >
              <div className="relative flex-shrink-0">
                <img
                  src={video.thumbnail || 'https://via.placeholder.com/160x90?text=Video'}
                  alt={video.title}
                  className="w-28 h-20 object-cover rounded-lg group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/160x90?text=Video';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                  <PlayCircleIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] uppercase tracking-[0.35em] text-red-600 font-semibold mb-1">YouTube</p>
                <h4 className="font-semibold leading-snug line-clamp-2 group-hover:text-red-600 transition">{video.title}</h4>
                {video.publishedAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(video.publishedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};


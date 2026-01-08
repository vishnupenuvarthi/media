import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translate } from '@/utils/translator';
import { PlayCircleIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import dayjs from '@/utils/dayjs';

export const YouTubePage = () => {
  const language = useLanguageStore((state) => state.language);
  const t = (key) => translate(language, `youtube.${key}`);
  
  const { data: videos, isLoading, error } = useQuery({
    queryKey: ['youtube-videos'],
    queryFn: async () => {
      const { data } = await api.get('/home?lang=' + language);
      return data.youtube || [];
    }
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 rounded w-1/3" />
          <div className="grid md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !videos || videos.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-12 text-center border-2 border-red-200">
          <PlayCircleIcon className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-3xl font-serif text-red-900 mb-4">No Videos Available</h2>
          <p className="text-red-700 mb-6">Videos from the channel will appear here once available.</p>
          <a
            href="https://www.youtube.com/@chinnap9430"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
          >
            Visit YouTube Channel <ArrowTopRightOnSquareIcon className="w-5 h-5" />
          </a>
        </div>
      </div>
    );
  }

  const featured = videos[0];
  const rest = videos.slice(1);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-3 rounded-xl">
              <PlayCircleIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-red-600/70 font-bold">NLR YouTube</p>
              <h1 className="text-4xl font-serif text-gray-900">{t('heading') || 'Latest Videos from Chinnap Channel'}</h1>
            </div>
          </div>
          <a
            href="https://www.youtube.com/@chinnap9430"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold shadow-md"
          >
            View Channel <ArrowTopRightOnSquareIcon className="w-5 h-5" />
          </a>
        </div>
      </div>

      {featured && (
        <div className="mb-10">
          <a
            href={featured.link}
            target="_blank"
            rel="noreferrer"
            className="group block bg-black rounded-2xl overflow-hidden relative shadow-2xl hover:shadow-3xl transition-all"
          >
            <div className="relative">
              <img
                src={featured.thumbnail || 'https://via.placeholder.com/1280x720?text=Video'}
                alt={featured.title}
                className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/1280x720?text=Video';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-red-600 rounded-full p-6 shadow-2xl transform group-hover:scale-110 transition-transform">
                  <PlayCircleIcon className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/90 backdrop-blur-sm text-sm uppercase tracking-[0.3em] font-semibold mb-3">
                <PlayCircleIcon className="w-5 h-5" />
                Featured Video
              </div>
              <h2 className="text-3xl font-serif font-bold leading-tight mb-2">{featured.title}</h2>
              {featured.description && (
                <p className="text-white/90 line-clamp-2 mb-2">{featured.description}</p>
              )}
              {featured.publishedAt && (
                <p className="text-sm text-white/70">{dayjs(featured.publishedAt).format('MMMM D, YYYY')}</p>
              )}
            </div>
          </a>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rest.map((video) => (
          <a
            key={video.id}
            href={video.link}
            target="_blank"
            rel="noreferrer"
            className="group bg-white rounded-xl overflow-hidden border-2 border-gray-200 hover:border-red-500 hover:shadow-xl transition-all duration-300"
          >
            <div className="relative">
              <img
                src={video.thumbnail || 'https://via.placeholder.com/640x360?text=Video'}
                alt={video.title}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/640x360?text=Video';
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                <PlayCircleIcon className="w-12 h-12 text-white" />
              </div>
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  YouTube
                </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-red-600 transition mb-2">
                {video.title}
              </h3>
              {video.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{video.description}</p>
              )}
              {video.publishedAt && (
                <p className="text-xs text-gray-500">{dayjs(video.publishedAt).fromNow()}</p>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};


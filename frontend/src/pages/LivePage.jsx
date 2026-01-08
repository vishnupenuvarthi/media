import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import dayjs from 'dayjs';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translate } from '@/utils/translator';

export const LivePage = () => {
  const { slug = '' } = useParams();
  const language = useLanguageStore((state) => state.language);
  const t = (key) => translate(language, `pages.live.${key}`);
  const { data, isLoading } = useQuery({
    queryKey: ['live', slug],
    queryFn: async () => {
      const { data } = await api.get(`/live/${slug}`);
      return data;
    },
    refetchInterval: 15_000
  });

  if (isLoading || !data) return <div className="max-w-4xl mx-auto px-4 py-12">{t('loading')}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <header>
        <p className="text-xs uppercase text-primary">{t('title')}</p>
        <h1 className="text-4xl font-serif">{data.title}</h1>
        <p className="text-gray-600">{data.summary ?? t('description')}</p>
      </header>
      <ol className="border-l-2 border-primary space-y-6 pl-6">
        {data.entries.map((entry) => (
          <li key={entry.id} className="relative">
            <span className="absolute -left-[13px] top-1.5 w-6 h-6 bg-primary rounded-full border-4 border-white" />
            <time className="text-xs uppercase text-gray-500">
              {dayjs(entry.timestamp).format('MMM D, h:mm A')}
            </time>
            <div className="mt-2 bg-gray-50 p-4 rounded-lg">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: entry.content }} />
              {entry.mediaUrl && <img src={entry.mediaUrl} className="mt-3 rounded-lg" />}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};


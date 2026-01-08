import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import dayjs from '@/utils/dayjs';
import { api } from '@/lib/api';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translate, translateCategory } from '@/utils/translator';

export const ArticlePage = () => {
  const { slug = '' } = useParams();
  const language = useLanguageStore((state) => state.language);
  const t = (key) => translate(language, `pages.article.${key}`);
  const { data, isLoading } = useQuery({
    queryKey: ['article', slug, language],
    queryFn: async () => {
      const { data } = await api.get(`/articles/${slug}?lang=${language}`);
      return data;
    }
  });

  if (isLoading || !data) {
    return <div className="max-w-3xl mx-auto px-4 py-12">{t('loading')}</div>;
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <header className="space-y-3">
        <p className="text-xs uppercase text-primary">{translateCategory(language, data.category)}</p>
        <h1 className="text-4xl font-serif font-semibold">{data.title}</h1>
        <p className="text-xl text-gray-600">{data.subtitle}</p>
        <div className="text-sm text-gray-500 flex gap-4 flex-wrap">
          <span>By {data.author.name}</span>
          <span>{dayjs(data.publishedAt).format('MMM D, YYYY h:mm A')}</span>
          <span>
            {t('updated')} {dayjs(data.updatedAt ?? data.publishedAt).fromNow()}
          </span>
          <span>{data.stats?.readTime ?? 5} min read</span>
        </div>
      </header>
      {data.heroImage ? (
        <img
          src={data.heroImage}
          alt={data.title}
          className="w-full rounded-xl"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/1200x600/4A5568/FFFFFF?text=News';
          }}
        />
      ) : (
        <div className="w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
          <span className="text-gray-400 text-lg">No Image Available</span>
        </div>
      )}
      <section className="prose max-w-none" dangerouslySetInnerHTML={{ __html: data.body }} />
      <section>
        <h3 className="font-semibold mb-2">{t('tags')}</h3>
        <div className="flex gap-2 flex-wrap">
          {data.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-gray-100 text-sm rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </section>
      <section className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">{t('related')}</h4>
        <div className="grid md:grid-cols-2 gap-4">
          {data.related?.map((story) => (
            <a key={story.id} href={`/article/${story.slug}`} className="text-sm font-medium hover:text-primary">
              {story.title}
            </a>
          ))}
        </div>
      </section>
    </article>
  );
};


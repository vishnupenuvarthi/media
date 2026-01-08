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
    queryKey: ['article', slug],
    queryFn: async () => {
      const { data } = await api.get(`/articles/${slug}`);
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
      <img
        src={data.heroImage ?? 'https://images.unsplash.com/photo-1470165518243-ff5de618be2b?auto=format&fit=crop&w=1200&q=60'}
        className="w-full rounded-xl"
      />
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


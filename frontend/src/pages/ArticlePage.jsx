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
    <article className="max-w-3xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12 space-y-4 sm:space-y-6">
      <header className="space-y-2 sm:space-y-3">
        <p className="text-[10px] sm:text-xs uppercase text-primary">{translateCategory(language, data.category)}</p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-semibold leading-tight">{data.title}</h1>
        {data.subtitle && (
          <p className="text-lg sm:text-xl text-gray-600">{data.subtitle}</p>
        )}
        <div className="text-xs sm:text-sm text-gray-500 flex flex-wrap gap-2 sm:gap-4">
          <span>By {data.author.name}</span>
          <span className="hidden sm:inline">·</span>
          <span>{dayjs(data.publishedAt).format('MMM D, YYYY h:mm A')}</span>
          <span className="hidden sm:inline">·</span>
          <span>
            {t('updated')} {dayjs(data.updatedAt ?? data.publishedAt).fromNow()}
          </span>
          <span className="hidden sm:inline">·</span>
          <span>{data.stats?.readTime ?? 5} min read</span>
        </div>
      </header>
      {data.heroImage ? (
        <img
          src={data.heroImage}
          alt={data.title}
          className="w-full rounded-lg sm:rounded-xl"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/1200x600/4A5568/FFFFFF?text=News';
          }}
        />
      ) : (
        <div className="w-full h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg sm:rounded-xl flex items-center justify-center">
          <span className="text-gray-400 text-sm sm:text-lg">No Image Available</span>
        </div>
      )}
      <section className="prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-headings:font-serif prose-p:text-gray-700 prose-a:text-primary prose-strong:text-gray-900" dangerouslySetInnerHTML={{ __html: data.body }} />
      <section>
        <h3 className="font-semibold mb-2 text-base sm:text-lg">{t('tags')}</h3>
        <div className="flex gap-2 flex-wrap">
          {data.tags.map((tag) => (
            <span key={tag} className="px-2 sm:px-3 py-1 bg-gray-100 text-xs sm:text-sm rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </section>
      {data.related && data.related.length > 0 && (
        <section className="bg-gray-50 p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl">
          <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">{t('related')}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {data.related.map((story) => (
              <a key={story.id} href={`/article/${story.slug}`} className="text-sm sm:text-base font-medium hover:text-primary transition">
                {story.title}
              </a>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};


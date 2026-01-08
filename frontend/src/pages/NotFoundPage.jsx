import { Link } from 'react-router-dom';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translate } from '@/utils/translator';

export const NotFoundPage = () => {
  const language = useLanguageStore((state) => state.language);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-6">
      <div>
        <p className="text-sm uppercase text-primary">404</p>
        <h1 className="text-4xl font-serif">{translate(language, 'notFound.title')}</h1>
        <p className="text-gray-600">{translate(language, 'notFound.description')}</p>
      </div>
      <Link to="/" className="px-4 py-2 bg-primary text-white rounded-full">
        {translate(language, 'pages.article.back')}
      </Link>
    </div>
  );
};


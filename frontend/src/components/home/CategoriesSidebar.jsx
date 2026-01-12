import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translate, translateCategory } from '@/utils/translator';

export const CategoriesSidebar = () => {
  const { data, isLoading } = useCategories();
  const language = useLanguageStore((state) => state.language);
  const t = (key) => translate(language, key);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-100 shadow-sm space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const categories = data?.categories || [];

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-100 shadow-sm">
      <h3 className="text-sm sm:text-base font-serif font-bold mb-4">
        {t('pages.home.categories') || 'Browse Categories'}
      </h3>
      <div className="space-y-2">
        {categories.map((category) => {
          const isCategoryRoute = `/category/${category.slug}`;
          
          return (
            <Link
              key={category.id}
              to={isCategoryRoute}
              className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition group"
            >
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-primary transition">
                  {translateCategory(language, category.title)}
                </p>
                {category.isDefault && (
                  <p className="text-[10px] text-primary font-semibold uppercase tracking-wider">Default</p>
                )}
              </div>
              <span className="text-primary text-lg group-hover:translate-x-1 transition">→</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

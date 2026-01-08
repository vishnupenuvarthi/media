import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translate } from '@/utils/translator';

export const DashboardPage = () => {
  const { data } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/newsroom/dashboard');
      return data;
    }
  });
  const language = useLanguageStore((state) => state.language);
  const t = (key) => translate(language, `pages.dashboard.${key}`);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase text-primary">{translate(language, 'header.newsroomAccess')}</p>
        <h1 className="text-3xl font-serif">{t('welcome')}</h1>
        <p className="text-gray-600">{t('description')}</p>
      </header>
      <section className="grid md:grid-cols-4 gap-4">
        {Object.entries(data?.stats ?? {}).map(([label, value]) => (
          <div key={label} className="p-4 rounded-xl border bg-white">
            <p className="text-xs uppercase text-gray-500">{label}</p>
            <p className="text-3xl font-semibold">{value}</p>
          </div>
        ))}
      </section>
      <section className="bg-white rounded-xl border">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">{t('reviewQueue')}</h2>
          <button className="text-sm px-3 py-1 border rounded-full">{t('viewAll')}</button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="p-3">{translate(language, 'pages.dashboard.columns.title')}</th>
              <th className="p-3">{translate(language, 'pages.dashboard.columns.reporter')}</th>
              <th className="p-3">{translate(language, 'pages.dashboard.columns.status')}</th>
              <th className="p-3">{translate(language, 'pages.dashboard.columns.updated')}</th>
            </tr>
          </thead>
          <tbody>
            {data?.queue.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3 font-medium">{item.title}</td>
                <td className="p-3">{item.author}</td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs">{item.status}</span>
                </td>
                <td className="p-3">{new Date(item.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};


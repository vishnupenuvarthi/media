import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { useLanguageStore } from '@/store/useLanguageStore';

export const AppLayout = () => {
  const language = useLanguageStore((state) => state.language);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <div className="min-h-screen flex flex-col bg-smoke">
      <Header />
      <main className="flex-1">
        <div className="bg-white/90 shadow-inner">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};


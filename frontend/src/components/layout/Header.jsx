import { Link, NavLink } from 'react-router-dom';
import { useMemo } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translate } from '@/utils/translator';

const primaryNavKeys = [
  { key: 'nlrCalendar', path: '/calendar' },
  { key: 'youtube', path: '/youtube' },
  { key: 'latest', path: '/' },
  { key: 'breaking', path: '/breaking', label: 'Breaking News' },
  { key: 'india', path: '/category/india' },
  { key: 'world', path: '/category/world' },
  { key: 'business', path: '/category/business' },
  { key: 'markets', path: '/category/markets' },
  { key: 'tech', path: '/category/tech' },
  { key: 'sports', path: '/category/sports' },
  { key: 'entertainment', path: '/category/entertainment' },
  { key: 'lifestyle', path: '/category/lifestyle' },
  { key: 'opinion', path: '/category/opinion' }
];

const secondaryNavKeys = [
  { key: 'cities', path: '/' },
  { key: 'budget', path: '/' },
  { key: 'elections', path: '/' },
  { key: 'calendar2026', path: '/calendar' },
  { key: 'podcasts', path: '/' },
  { key: 'explainers', path: '/' },
  { key: 'photos', path: '/' },
  { key: 'videos', path: '/' }
];

const languageOptions = [
  { code: 'en', label: 'English' },
  { code: 'te', label: 'తెలుగు' }
];

export const Header = () => {
  const now = useMemo(() => new Date().toLocaleString('en-IN', { hour12: true }), []);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { language, setLanguage } = useLanguageStore();

  const t = (key, replacements) => translate(language, key, replacements);

  return (
    <header className="sticky top-0 z-40 shadow-sm shadow-black/5">
      <div className="bg-secondary text-xs text-gray-300">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between px-4 py-2">
          <p>{now}</p>
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.3em]">
            <div className="flex items-center gap-1">
              {languageOptions.map((option) => (
                <button
                  key={option.code}
                  type="button"
                  onClick={() => setLanguage(option.code)}
                  className={`px-2 py-1 rounded-full text-[10px] tracking-normal ${
                    language === option.code ? 'bg-white text-secondary font-semibold' : 'hover:text-white transition'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <button type="button" className="hover:text-white transition">
              {t('header.ePaper')}
            </button>
            <button type="button" className="hover:text-white transition">
              {t('header.hindi')}
            </button>
            <Link to="/newsletter" className="hover:text-white">
              {t('header.newsletter')}
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-2 text-xs">
                <span className="tracking-normal">{`${t('header.newsroomAccess')}, ${user?.name ?? 'Team'}`}</span>
                <Link to="/dashboard" className="border border-white/30 px-3 py-1 rounded-full hover:bg-white/10">
                  {t('header.dashboard')}
                </Link>
                <button type="button" onClick={logout} className="hover:text-white transition tracking-normal">
                  {t('header.logout')}
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="border border-white/30 px-3 py-1 rounded-full hover:bg-white/10 tracking-normal">
                  {t('header.login')}
                </Link>
                <Link
                  to="/register"
                  className="border border-white px-3 py-1 rounded-full bg-white text-secondary font-semibold tracking-normal"
                >
                  {t('header.register')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <Link
              to="/"
              className="text-4xl font-serif font-semibold uppercase tracking-[.3rem] text-primary block leading-none"
            >
              NLR LIVE NEWS
            </Link>
            <p className="text-xs uppercase tracking-[0.4em] text-gray-500 mt-1">{t('header.tagline')}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex flex-col text-right text-xs text-gray-500">
              <span>{t('header.temperatureLabel')}</span>
              <span className="text-sm text-primary font-semibold">28°C | AQI 86</span>
            </div>
            <div className="relative">
              <input
                className="border border-gray-300 rounded-full pl-4 pr-10 py-2 text-sm w-56 focus:outline-primary bg-gray-50"
                placeholder={language === 'te' ? 'NLR LIVE NEWS శోధన' : 'Search NLR LIVE NEWS'}
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-primary absolute right-3 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      <nav className="bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap text-sm font-semibold tracking-wide text-gray-700">
            {primaryNavKeys.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                className={({ isActive }) =>
                  [
                    'px-3 py-3 border-b-2 border-transparent hover:border-primary hover:text-primary transition',
                    isActive ? 'text-primary border-primary' : ''
                  ].join(' ')
                }
              >
                {item.label || translate(language, `header.primaryNav.${item.key}`)}
              </NavLink>
            ))}
          </div>
          <div className="flex flex-wrap text-xs uppercase tracking-widest text-gray-500 border-t border-gray-100 py-2">
            {secondaryNavKeys.map((item) => (
              <Link key={item.key} to={item.path} className="px-2 py-1 hover:text-primary transition">
                {translate(language, `header.secondaryNav.${item.key}`)}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};


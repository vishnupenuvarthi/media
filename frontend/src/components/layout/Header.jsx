import { Link, NavLink } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translate } from '@/utils/translator';

const primaryNavKeys = [
  { key: 'nlrCalendar', path: '/calendar' },
  { key: 'youtube', path: '/youtube' },
  { key: 'latest', path: '/news' },
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
  { key: 'cities', path: '/category/tag/cities' },
  { key: 'budget', path: '/category/tag/budget' },
  { key: 'elections', path: '/category/tag/elections' },
  { key: 'calendar2026', path: '/calendar' },
  { key: 'podcasts', path: '/category/tag/podcasts' },
  { key: 'explainers', path: '/category/tag/explainers' },
  { key: 'photos', path: '/category/tag/photos' },
  { key: 'videos', path: '/category/tag/videos' }
];

const languageOptions = [
  { code: 'en', label: 'English' },
  { code: 'te', label: 'తెలుగు' }
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const now = useMemo(() => new Date().toLocaleString('en-IN', { hour12: true }), []);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { language, setLanguage } = useLanguageStore();

  const t = (key, replacements) => translate(language, key, replacements);

  return (
    <header className="sticky top-0 z-50 shadow-sm shadow-black/5 bg-white">
      {/* Top Bar - Responsive */}
      <div className="bg-secondary text-xs text-gray-300">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between px-3 sm:px-4 py-2 gap-2">
          <p className="text-[10px] sm:text-xs truncate">{now}</p>
          <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.3em]">
            <div className="flex items-center gap-1">
              {languageOptions.map((option) => (
                <button
                  key={option.code}
                  type="button"
                  onClick={() => setLanguage(option.code)}
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] tracking-normal ${language === option.code ? 'bg-white text-secondary font-semibold' : 'hover:text-white transition'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="hidden sm:flex items-center gap-2 sm:gap-4">
              <button type="button" className="hover:text-white transition whitespace-nowrap">
                {t('header.ePaper')}
              </button>
              <button type="button" className="hover:text-white transition whitespace-nowrap">
                {t('header.hindi')}
              </button>
              <Link to="/newsletter" className="hover:text-white whitespace-nowrap">
                {t('header.newsletter')}
              </Link>
            </div>
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2 text-xs">
                <span className="tracking-normal truncate max-w-[100px]">{`${t('header.newsroomAccess')}, ${user?.name ?? 'Team'}`}</span>
                <Link to="/dashboard" className="border border-white/30 px-2 sm:px-3 py-1 rounded-full hover:bg-white/10 text-[10px] sm:text-xs whitespace-nowrap">
                  {t('header.dashboard')}
                </Link>
                <button type="button" onClick={logout} className="hover:text-white transition tracking-normal text-[10px] sm:text-xs whitespace-nowrap">
                  {t('header.logout')}
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="border border-white/30 px-2 sm:px-3 py-1 rounded-full hover:bg-white/10 tracking-normal text-[10px] sm:text-xs whitespace-nowrap">
                  {t('header.login')}
                </Link>
                <Link
                  to="/register"
                  className="border border-white px-2 sm:px-3 py-1 rounded-full bg-white text-secondary font-semibold tracking-normal text-[10px] sm:text-xs whitespace-nowrap"
                >
                  {t('header.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logo and Search Bar - Responsive */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 gap-3">
          <div className="flex-1 min-w-0">
            <Link
              to="/"
              className="text-2xl sm:text-3xl lg:text-4xl font-serif font-semibold uppercase tracking-[.2rem] sm:tracking-[.3rem] text-primary block leading-tight hover:opacity-90 transition"
            >
              NLR LIVE NEWS
            </Link>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-gray-500 mt-0.5 sm:mt-1 truncate">{t('header.tagline')}</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:flex flex-col text-right text-xs text-gray-500">
              <span className="uppercase tracking-wider font-bold text-gray-400">Nellore</span>
              <span className="text-sm text-primary font-semibold">32°C | AQI 42</span>
            </div>
            <div className="relative hidden sm:block">
              <input
                className="border border-gray-300 rounded-full pl-3 sm:pl-4 pr-8 sm:pr-10 py-1.5 sm:py-2 text-xs sm:text-sm w-32 sm:w-48 lg:w-56 focus:outline-primary bg-gray-50"
                placeholder={language === 'te' ? 'శోధన' : 'Search'}
              />
              <MagnifyingGlassIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary absolute right-2 sm:right-3 top-1/2 -translate-y-1/2" />
            </div>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 text-gray-700 hover:text-primary transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation - Desktop */}
      <nav className="hidden sm:block bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-3 sm:px-4">
          <div className="flex flex-wrap text-xs sm:text-sm font-semibold tracking-wide text-gray-700 overflow-x-auto scrollbar-hide">
            {primaryNavKeys.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                className={({ isActive }) =>
                  [
                    'px-2 sm:px-3 py-2 sm:py-3 border-b-2 border-transparent hover:border-primary hover:text-primary transition whitespace-nowrap',
                    isActive ? 'text-primary border-primary' : ''
                  ].join(' ')
                }
              >
                {item.label || translate(language, `header.primaryNav.${item.key}`)}
              </NavLink>
            ))}
          </div>
          <div className="flex flex-wrap text-[10px] sm:text-xs uppercase tracking-widest text-gray-500 border-t border-gray-100 py-1.5 sm:py-2 gap-1 sm:gap-0">
            {secondaryNavKeys.map((item) => (
              <Link key={item.key} to={item.path} className="px-1.5 sm:px-2 py-0.5 sm:py-1 hover:text-primary transition whitespace-nowrap">
                {translate(language, `header.secondaryNav.${item.key}`)}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Slide Down */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-gray-200 shadow-lg max-h-[calc(100vh-120px)] overflow-y-auto">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <input
                className="w-full border border-gray-300 rounded-full pl-4 pr-10 py-2 text-sm focus:outline-primary bg-gray-50"
                placeholder={language === 'te' ? 'NLR LIVE NEWS శోధన' : 'Search NLR LIVE NEWS'}
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-primary absolute right-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Mobile Auth Buttons */}
            {!isAuthenticated && (
              <div className="flex gap-2 pb-4 border-b border-gray-200">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center border border-primary px-4 py-2 rounded-full text-primary font-semibold hover:bg-primary hover:text-white transition"
                >
                  {t('header.login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center bg-primary text-white px-4 py-2 rounded-full font-semibold hover:bg-primary/90 transition"
                >
                  {t('header.register')}
                </Link>
              </div>
            )}

            {/* Primary Navigation */}
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-gray-500 px-2 py-1">Main Menu</p>
              {primaryNavKeys.map((item) => (
                <NavLink
                  key={item.key}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    [
                      'block px-4 py-3 rounded-lg text-sm font-semibold transition',
                      isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                    ].join(' ')
                  }
                >
                  {item.label || translate(language, `header.primaryNav.${item.key}`)}
                </NavLink>
              ))}
            </div>

            {/* Secondary Navigation */}
            <div className="space-y-1 pt-4 border-t border-gray-200">
              <p className="text-xs uppercase tracking-widest text-gray-500 px-2 py-1">More</p>
              {secondaryNavKeys.map((item) => (
                <Link
                  key={item.key}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition"
                >
                  {translate(language, `header.secondaryNav.${item.key}`)}
                </Link>
              ))}
            </div>

            {/* User Menu (Mobile) */}
            {isAuthenticated && (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <p className="text-xs text-gray-500 px-2">{`${t('header.newsroomAccess')}, ${user?.name ?? 'Team'}`}</p>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-lg text-sm font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition"
                >
                  {t('header.dashboard')}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition"
                >
                  {t('header.logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

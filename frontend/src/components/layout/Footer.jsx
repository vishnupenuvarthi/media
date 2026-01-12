import { useLanguageStore } from '@/store/useLanguageStore';
import { translate, translateArray } from '@/utils/translator';

const socialLinks = ['Twitter', 'YouTube', 'LinkedIn', 'Instagram'];

const defaultContent = {
  trustline: 'Trusted since 1961',
  aboutTitle: 'NLR LIVE NEWS',
  aboutDescription: 'Real-time, trustworthy reporting powered by a modern newsroom stack and experienced journalists across India.',
  networkTitle: 'Network',
  newsroomTitle: 'News Sections',
  quickLinksTitle: 'Quick Links',
  newsletterTitle: 'Daily Briefing',
  newsletterDescription: 'Morning intelligence on politics, markets, and the world.',
  subscribe: 'Subscribe',
  emailPlaceholder: 'Email'
};

const defaultColumns = {
  network: ['About Us', 'Editorial Code', 'Careers', 'Advertise', 'Syndication', 'Contact'],
  newsroom: ['Nation', 'Politics', 'Markets', 'Tech & Startups', 'Sports', 'Culture'],
  quickLinks: ['e-Paper', 'Podcasts', 'Newsletters', 'Archives', 'RSS Feeds', 'Apps']
};

export const Footer = () => {
  const language = useLanguageStore((state) => state.language);

  // Helper to safely get array content
  const getLinks = (key, defaultKey) => {
    const items = translateArray(language, key);
    return items.length > 0 ? items : defaultColumns[defaultKey];
  };

  return (
    <footer className="bg-secondary text-gray-300 mt-12 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-16 grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">

        {/* Column 1: Brand */}
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-primary/80 font-bold mb-2">
              {translate(language, 'footer.trustline') || defaultContent.trustline}
            </p>
            <h4 className="text-3xl font-serif font-bold text-white tracking-tight">
              {translate(language, 'footer.aboutTitle') || defaultContent.aboutTitle}
            </h4>
          </div>

          <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
            {translate(language, 'footer.aboutDescription') || defaultContent.aboutDescription}
          </p>

          <div className="flex gap-3">
            {socialLinks.map((item) => (
              <span key={item} className="px-3 py-1.5 border border-white/10 bg-white/5 rounded-full text-xs font-medium hover:bg-white hover:text-black cursor-pointer transition-all duration-300">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Column 2: Network */}
        <div>
          <h5 className="font-bold text-white uppercase tracking-widest text-xs mb-6 border-b border-gray-800 pb-2 inline-block">
            {translate(language, 'footer.networkTitle') || defaultContent.networkTitle}
          </h5>
          <ul className="space-y-3 text-sm text-gray-400">
            {getLinks('footer.columns.network', 'network').map((item) => (
              <li key={item} className="hover:text-primary hover:translate-x-1 transition-all cursor-pointer block">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Newsroom */}
        <div>
          <h5 className="font-bold text-white uppercase tracking-widest text-xs mb-6 border-b border-gray-800 pb-2 inline-block">
            {translate(language, 'footer.newsroomTitle') || defaultContent.newsroomTitle}
          </h5>
          <ul className="space-y-3 text-sm text-gray-400">
            {getLinks('footer.columns.newsroom', 'newsroom').map((item) => (
              <li key={item} className="hover:text-primary hover:translate-x-1 transition-all cursor-pointer block">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div>
          <h5 className="font-bold text-white uppercase tracking-widest text-xs mb-6 border-b border-gray-800 pb-2 inline-block">
            {translate(language, 'footer.quickLinksTitle') || defaultContent.quickLinksTitle}
          </h5>
          <ul className="space-y-3 text-sm text-gray-400 mb-8">
            {getLinks('footer.columns.quickLinks', 'quickLinks').map((item) => (
              <li key={item} className="hover:text-primary hover:translate-x-1 transition-all cursor-pointer block">
                {item}
              </li>
            ))}
          </ul>

          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h6 className="font-bold text-white uppercase tracking-widest text-[10px] mb-2">
              {translate(language, 'footer.newsletterTitle') || defaultContent.newsletterTitle}
            </h6>
            <p className="text-xs text-gray-400 mb-3 leading-relaxed">
              {translate(language, 'footer.newsletterDescription') || defaultContent.newsletterDescription}
            </p>
            <div className="flex gap-2">
              <input
                className="flex-1 px-3 py-2 rounded bg-black/30 border border-white/10 text-xs text-white focus:outline-none focus:border-primary transition-colors placeholder:text-gray-600"
                placeholder={translate(language, 'footer.emailPlaceholder') || defaultContent.emailPlaceholder}
              />
              <button type="button" className="px-3 py-2 bg-primary hover:bg-red-700 text-white rounded text-xs font-bold uppercase tracking-wider transition-colors">
                GO
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 bg-black/20">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-600 uppercase tracking-wider font-medium">
          <p>© {new Date().getFullYear()} NLR LIVE NEWS Media Group.</p>
          <div className="flex gap-6">
            <span className="cursor-pointer hover:text-gray-400 transition-colors">Privacy Policy</span>
            <span className="cursor-pointer hover:text-gray-400 transition-colors">Terms of Service</span>
            <span className="cursor-pointer hover:text-gray-400 transition-colors">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};


import { useLanguageStore } from '@/store/useLanguageStore';
import { translate, translateArray } from '@/utils/translator';

const socialLinks = ['Twitter', 'YouTube', 'LinkedIn', 'Instagram'];

export const Footer = () => {
  const language = useLanguageStore((state) => state.language);

  return (
    <footer className="bg-secondary text-gray-300 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-12 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-gray-500">{translate(language, 'footer.trustline')}</p>
          <h4 className="text-3xl font-serif font-semibold text-white mt-1">{translate(language, 'footer.aboutTitle')}</h4>
          <p className="text-sm text-gray-400 mt-4 leading-relaxed">{translate(language, 'footer.aboutDescription')}</p>
          <div className="flex gap-3 mt-5 text-sm">
            {socialLinks.map((item) => (
              <span key={item} className="px-3 py-1 border border-white/20 rounded-full hover:bg-white/10 cursor-pointer">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h5 className="font-semibold text-white uppercase tracking-widest text-xs mb-3">
            {translate(language, 'footer.networkTitle')}
          </h5>
          <ul className="space-y-2 text-sm">
            {translateArray(language, 'footer.columns.network').map((item) => (
              <li key={item} className="hover:text-white cursor-pointer transition">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="font-semibold text-white uppercase tracking-widest text-xs mb-3">
            {translate(language, 'footer.newsroomTitle')}
          </h5>
          <ul className="space-y-2 text-sm">
            {translateArray(language, 'footer.columns.newsroom').map((item) => (
              <li key={item} className="hover:text-white cursor-pointer transition">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="font-semibold text-white uppercase tracking-widest text-xs mb-3">
            {translate(language, 'footer.quickLinksTitle')}
          </h5>
          <ul className="space-y-2 text-sm">
            {translateArray(language, 'footer.columns.quickLinks').map((item) => (
              <li key={item} className="hover:text-white cursor-pointer transition">
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <h6 className="font-semibold text-white uppercase tracking-widest text-[11px] mb-3">
              {translate(language, 'footer.newsletterTitle')}
            </h6>
            <p className="text-sm text-gray-400 mb-4">{translate(language, 'footer.newsletterDescription')}</p>
            <div className="flex gap-2">
              <input
                className="flex-1 px-3 py-2 rounded bg-white/10 border border-white/20 text-sm"
                placeholder={translate(language, 'footer.emailPlaceholder')}
              />
              <button type="button" className="px-4 py-2 bg-primary rounded text-white text-sm font-semibold">
                {translate(language, 'footer.subscribe')}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 text-center text-xs py-4 text-gray-500">
        © {new Date().getFullYear()} NLR LIVE NEWS Media Group. All rights reserved.
      </div>
    </footer>
  );
};


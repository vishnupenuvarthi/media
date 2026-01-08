import { megaphoneIcon } from '@/lib/icons';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translate } from '@/utils/translator';

export const BreakingTicker = ({ items = [], isLoading = false }) => {
  const language = useLanguageStore((state) => state.language);
  const label = translate(language, 'ticker.label');
  const loadingText = translate(language, 'latest.loading');

  return (
    <div className="bg-gradient-to-r from-secondary via-secondary to-primary text-white">
      <div className="max-w-6xl mx-auto flex items-center gap-6 py-3 px-4 overflow-hidden">
        <div className="flex items-center gap-2 text-accent font-cond uppercase tracking-[0.3em] text-xs">
          {megaphoneIcon}
          {label}
        </div>
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="animate-pulse text-sm text-white/70">{loadingText}</div>
          ) : items.length > 0 ? (
            <div className="ticker-track text-sm">
              {items.map((item) => (
                <span key={item.id} className="border-r border-white/30 pr-6 mr-6">
                  {item.title}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-sm text-white/70">{translate(language, 'ticker.noNews') || 'No breaking news at the moment'}</div>
          )}
        </div>
      </div>
    </div>
  );
};


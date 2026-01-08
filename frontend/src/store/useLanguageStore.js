import { create } from 'zustand';

const storageKey = 'bb-language';

const getInitialLanguage = () => {
  if (typeof window === 'undefined') {
    return 'te'; // Default to Telugu
  }
  const stored = window.localStorage.getItem(storageKey);
  return stored ?? 'te'; // Default to Telugu
};

export const useLanguageStore = create((set) => ({
  language: getInitialLanguage(),
  setLanguage: (lang) => {
    set({ language: lang });
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, lang);
      document.documentElement.lang = lang;
    }
  }
}));



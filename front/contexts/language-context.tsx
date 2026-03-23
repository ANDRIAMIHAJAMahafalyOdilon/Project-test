'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Lang } from '@/lib/i18n';
import { getT } from '@/lib/i18n';
import { loadMockState } from '@/lib/mock-persistence';
import { mockSettings } from '@/mock/users';

const LANGUAGE_STORAGE_KEY = 'app-settings';
const UI_LANG_STORAGE_KEY = 'docuflow:ui-lang:v1';

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: ReturnType<typeof getT>;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Lire la langue depuis la persistance mock (app-settings)
  const initialLang: Lang = (() => {
    try {
      if (typeof window !== 'undefined') {
        const storedUiLang = localStorage.getItem(UI_LANG_STORAGE_KEY);
        if (storedUiLang === 'fr' || storedUiLang === 'en') return storedUiLang;
      }

      const settings = loadMockState(LANGUAGE_STORAGE_KEY, mockSettings);
      const value = settings?.general?.language;
      return value === 'fr' ? 'fr' : 'en';
    } catch {
      return 'en';
    }
  })();

  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (next: Lang) => {
    setLangState(next);
    try {
      document.documentElement.lang = next;
      if (typeof window !== 'undefined') {
        localStorage.setItem(UI_LANG_STORAGE_KEY, next);
      }
    } catch {
      // ignore
    }
  };

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      t: getT(lang),
    }),
    [lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider.');
  return ctx;
}


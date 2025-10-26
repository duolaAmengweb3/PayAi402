'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { translations, Language, TranslationKey } from '../lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en'); // 默认英文

  const t = (key: TranslationKey, params?: Record<string, string>): string => {
    let text = translations[language][key] as string;

    if (params) {
      Object.keys(params).forEach(paramKey => {
        text = text.replace(`{${paramKey}}`, params[paramKey]);
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

'use client';

import { useLanguage } from '../contexts/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
        <button
          onClick={() => setLanguage('en')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            language === 'en'
              ? 'bg-primary text-white'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage('zh')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            language === 'zh'
              ? 'bg-primary text-white'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          中文
        </button>
      </div>
    </div>
  );
}

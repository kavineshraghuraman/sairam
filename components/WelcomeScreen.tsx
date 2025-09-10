import React from 'react';
import { Language } from '../types';
import { useTranslations } from '../i18n';

interface WelcomeScreenProps {
  onExampleClick: (query: string) => void;
  language: Language;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onExampleClick, language }) => {
  const t = useTranslations(language);
  const examples = [
    t('example1'),
    t('example2'),
    t('example3'),
    t('example4'),
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-600 dark:text-gray-400">
      <div className="max-w-2xl">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-green-500 mx-auto mb-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3.5a1 1 0 00.002 1.84L9 10.849l-1.51-1.007a1 1 0 10-1.21.806l2.001 1.334a1 1 0 001.212 0l2-1.334a1 1 0 10-1.212-.806L11 10.85l6.392-3.429a1 1 0 00.002-1.84l-7-3.5z" />
          <path d="M9 12.299l-7-3.5V14a1 1 0 001 1h12a1 1 0 001-1V8.799l-7 3.5z" />
        </svg>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">{t('welcomeTitle')}</h1>
        <p className="text-lg mb-8">{t('welcomeSubtitle')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {examples.map((example, i) => (
            <button
              key={i}
              onClick={() => onExampleClick(example)}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-left hover:bg-green-100 dark:hover:bg-gray-700 hover:border-green-300 dark:hover:border-green-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <p className="font-semibold text-gray-700 dark:text-gray-300">{example}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
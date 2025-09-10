import React from 'react';
import { Theme, Language } from '../types';
import { MoonIcon, SunIcon } from './icons/Icons';

const LeafIcon = () => (
    <svg xmlns="http://www.w.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        <path d="M15.999 5.4a1 1 0 00-1.414-1.414L10 8.586l-1.293-1.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l5.292-5.293z" />
        <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v.516c0 .44-.19 1.1-.555 1.758C9.56 6.14 9 7.2 9 8.5c0 .66.19 1.5.555 2.174.364.658.555 1.318.555 1.758v.516a.75.75 0 01-1.5 0v-.516c0-.44.19-1.1.555-1.758C9.44 9.86 10 8.8 10 7.5c0-.66-.19-1.5-.555-2.174C9.08 4.668 8.89 4.008 8.89 3.568V2.75A.75.75 0 0110 2z" transform="translate(-2.5, 1) rotate(-15 10 7.5)" opacity="0.6" />
    </svg>
);

interface HeaderProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    language: Language;
    setLanguage: (language: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ theme, setTheme, language, setLanguage }) => {
  const toggleTheme = () => {
    setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };
  
  const toggleLanguage = () => {
    setLanguage(language === Language.EN ? Language.TA : Language.EN);
  };

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
            <LeafIcon />
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 ml-2">
            Farmers Friend <span className="text-green-600">AI</span>
            </h1>
        </div>
        <div className="flex items-center gap-4">
            <button
                onClick={toggleLanguage}
                className="font-semibold text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 focus:outline-none"
                aria-label={`Switch to ${language === Language.EN ? 'Tamil' : 'English'}`}
            >
                <span className={language === Language.EN ? 'font-bold' : ''}>EN</span> / <span className={language === Language.TA ? 'font-bold' : ''}>TA</span>
            </button>
            <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
                {theme === Theme.LIGHT ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
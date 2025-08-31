import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  // 优化语言匹配逻辑，支持更精确的语言识别
  const getCurrentLanguage = () => {
    // 首先尝试精确匹配
    const exactMatch = languages.find(lang => lang.code === i18n.language);
    if (exactMatch) return exactMatch;
    
    // 如果没有精确匹配，尝试语言前缀匹配（如 zh-CN 匹配 zh）
    const langPrefix = i18n.language.split('-')[0];
    const prefixMatch = languages.find(lang => lang.code === langPrefix);
    if (prefixMatch) return prefixMatch;
    
    // 最后回退到英文
    return languages.find(lang => lang.code === 'en') || languages[0];
  };

  const currentLanguage = getCurrentLanguage();

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-2.5 py-1.5 border border-gray-200 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="text-base mr-1">{currentLanguage.flag}</span>
        <span className="hidden md:inline text-sm">{currentLanguage.name}</span>
        <svg
          className="ml-2 -mr-1 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
            <div className="py-1" role="menu" aria-orientation="vertical">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                {t('language.selector')}
              </div>
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`
                    w-full text-left px-4 py-2 text-sm transition-colors
                    ${i18n.language === language.code 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                  role="menuitem"
                >
                  <span className="mr-3">{language.flag}</span>
                  {language.name}
                  {i18n.language === language.code && (
                    <span className="ml-2 text-blue-600">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
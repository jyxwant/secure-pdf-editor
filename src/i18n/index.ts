import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { resources } from './resources';

// 仅在客户端启用语言检测器
if (typeof window !== 'undefined') {
  i18n.use(LanguageDetector);
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'zh', 'fr'], 
    nonExplicitSupportedLngs: true, 
    debug: false, 
    
    // 关键配置：关闭 Suspense 以支持 SSR/SSG 正确渲染内容
    react: {
      useSuspense: false
    },
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      lookupQuerystring: 'lng',
      lookupLocalStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      caches: ['localStorage'],
      excludeCacheFor: ['cimode'],
      convertDetectedLanguage: (lng: string) => {
        const langMap: { [key: string]: string } = {
          'zh-CN': 'zh',
          'zh-Hans': 'zh',
          'zh-Hant': 'zh',
          'zh-TW': 'zh',
          'zh-HK': 'zh',
          'en-US': 'en',
          'en-GB': 'en',
          'fr-FR': 'fr',
          'fr-CA': 'fr'
        };
        return langMap[lng] || lng.split('-')[0];
      }
    },
  });

export default i18n;

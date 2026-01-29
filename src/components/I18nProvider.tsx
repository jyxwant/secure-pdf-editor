'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { ReactNode, useMemo } from 'react';

export default function I18nProvider({ children, locale }: { children: ReactNode; locale: string }) {
  // Use useMemo to ensure this runs synchronously during render (including SSR)
  // avoiding useEffect which only runs on client
  useMemo(() => {
    if (locale && i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale]);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}

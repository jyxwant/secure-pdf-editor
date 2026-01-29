'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { ReactNode, useMemo } from 'react';

export default function I18nProvider({ children, locale }: { children: ReactNode; locale: string }) {
  // Use useMemo to create a new instance for each render/request
  // This avoids singleton race conditions in SSR and ensures correct language
  const i18nInstance = useMemo(() => {
    const instance = i18n.cloneInstance();
    instance.changeLanguage(locale);
    return instance;
  }, [locale]);

  return (
    <I18nextProvider i18n={i18nInstance}>
      {children}
    </I18nextProvider>
  );
}

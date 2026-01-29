'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { ReactNode, useEffect, useState } from 'react';

export default function I18nProvider({ children, locale }: { children: ReactNode; locale: string }) {
  // Sync language with locale prop
  if (i18n.language !== locale) {
    i18n.changeLanguage(locale);
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}

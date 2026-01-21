'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { ReactNode, useEffect, useState } from 'react';

export default function I18nProvider({ children, locale }: { children: ReactNode; locale: string }) {
  const [mounted, setMounted] = useState(false);

  // Sync language with locale prop
  if (i18n.language !== locale) {
    i18n.changeLanguage(locale);
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by rendering only after mount
  if (!mounted) {
    // Return children wrapped in a div with suppressHydrationWarning
    // This is a common workaround for i18n hydration issues in Next.js
    return (
      <div suppressHydrationWarning>
        {children}
      </div>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}

'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { ReactNode, useEffect, useState } from 'react';

export default function I18nProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by rendering only after mount
  if (!mounted) {
    return <>{children}</>; 
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

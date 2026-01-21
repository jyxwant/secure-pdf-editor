'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import LegalWrapper from '@/components/legal/LegalWrapper';

export default function TermsPage() {
  const { t } = useTranslation();
  return (
    <LegalWrapper title={t('legal.terms.title')}>
      <p className="text-sm text-gray-500 font-bold border-b-2 border-gray-200 pb-4 mb-6">{t('legal.terms.updated')}</p>

      <h3>{t('legal.terms.acceptance.title')}</h3>
      <p>{t('legal.terms.acceptance.content')}</p>

      <h3>{t('legal.terms.license.title')}</h3>
      <p>{t('legal.terms.license.content')}</p>

      <h3>{t('legal.terms.disclaimer.title')}</h3>
      <p>{t('legal.terms.disclaimer.content')}</p>

      <h3>{t('legal.terms.limitations.title')}</h3>
      <p>{t('legal.terms.limitations.content')}</p>
    </LegalWrapper>
  );
}

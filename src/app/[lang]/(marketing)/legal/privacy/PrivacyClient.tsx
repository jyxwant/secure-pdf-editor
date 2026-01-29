'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import LegalWrapper from '@/components/legal/LegalWrapper';

export default function PrivacyPage() {
  const { t } = useTranslation();
  return (
    <LegalWrapper title={t('legal.privacy.title')}>
      <p className="text-sm text-gray-500 font-bold border-b-2 border-gray-200 pb-4 mb-6">{t('legal.privacy.updated')}</p>
      
      <h3>{t('legal.privacy.collection.title')}</h3>
      <p>{t('legal.privacy.collection.content')}</p>

      <h3>{t('legal.privacy.usage.title')}</h3>
      <p>{t('legal.privacy.usage.content')}</p>

      <h3>{t('legal.privacy.cookies.title')}</h3>
      <p>{t('legal.privacy.cookies.content')}</p>

      <h3>{t('legal.privacy.thirdparty.title')}</h3>
      <p>{t('legal.privacy.thirdparty.content')}</p>

      <h3>{t('legal.privacy.contact.title')}</h3>
      <p>{t('legal.privacy.contact.content')}</p>
    </LegalWrapper>
  );
}

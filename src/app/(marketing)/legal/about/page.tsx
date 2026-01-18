'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import LegalWrapper from '@/components/legal/LegalWrapper';

export default function AboutPage() {
  const { t } = useTranslation();
  return (
    <LegalWrapper title={t('legal.about.title')}>
      <p>{t('legal.about.intro')}</p>
      
      <h3>{t('legal.about.mission.title')}</h3>
      <p>{t('legal.about.mission.content')}</p>
      
      <h3>{t('legal.about.why.title')}</h3>
      <ul>
        <li><strong>{t('legal.about.why.1')}</strong></li>
        <li><strong>{t('legal.about.why.2')}</strong></li>
        <li><strong>{t('legal.about.why.3')}</strong></li>
      </ul>
    </LegalWrapper>
  );
}

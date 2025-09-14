import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserGuide } from '../components/SEO/UserGuide';
import { SEOHead } from '../components/SEO/SEOHead';

export function GuidePage() {
  const { t } = useTranslation();

  return (
    <>
      <SEOHead 
        title={`${t('guide.title')} - ${t('app.title')}`}
        description={t('guide.subtitle')}
        keywords="PDF redaction guide, how to redact PDF, document security tutorial"
        canonicalUrl="/guide"
        lang="en"
        alternates={{ en: 'https://secureredact.tech/guide' }}
      />
      <div className="max-w-6xl mx-auto p-6">
        <UserGuide />
      </div>
    </>
  );
}

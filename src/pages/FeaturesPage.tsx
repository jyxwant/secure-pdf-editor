import React from 'react';
import { useTranslation } from 'react-i18next';
import { Features } from '../components/SEO/Features';
import { SEOHead } from '../components/SEO/SEOHead';

export function FeaturesPage() {
  const { t } = useTranslation();

  return (
    <>
      <SEOHead 
        title={`${t('features.title')} - ${t('app.title')}`}
        description={t('features.subtitle')}
        keywords="PDF redaction features, document security, local processing, privacy protection"
        canonicalUrl="/features"
      />
      <div className="max-w-6xl mx-auto p-6">
        <Features />
      </div>
    </>
  );
}
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FAQ } from '../components/SEO/FAQ';
import { SEOHead } from '../components/SEO/SEOHead';

export function FAQPage() {
  const { t } = useTranslation();

  return (
    <>
      <SEOHead 
        title={`${t('faq.title')} - ${t('app.title')}`}
        description={t('faq.subtitle')}
        keywords="PDF redaction FAQ, document security questions, privacy protection help"
        canonicalUrl="/faq"
        lang="en"
        alternates={{ en: 'https://secureredact.tech/faq' }}
      />
      <div className="max-w-4xl mx-auto p-6">
        <FAQ />
      </div>
    </>
  );
}

import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  lang?: 'en' | 'zh' | 'fr';
  siteName?: string;
  alternates?: { en?: string; zh?: string; fr?: string };
  twitterSite?: string;
  twitterCreator?: string;
  ogImageAlt?: string;
  noindex?: boolean;
}

export function SEOHead({ 
  title = 'PDF Security Editor', 
  description = 'Secure PDF redaction tool with local processing',
  keywords = 'PDF redaction, secure PDF editor, document privacy, GDPR, HIPAA, local processing',
  canonicalUrl = '/',
  ogImage = '/favicon.svg',
  ogType = 'website',
  lang = 'en',
  siteName = 'SecureRedact',
  alternates,
  twitterSite,
  twitterCreator,
  ogImageAlt,
  noindex = false,
}: SEOHeadProps) {
  const base = 'https://secureredact.tech';
  const fullUrl = canonicalUrl.startsWith('http') ? canonicalUrl : `${base}${canonicalUrl}`;

  const locale = lang === 'zh' ? 'zh_CN' : lang === 'fr' ? 'fr_FR' : 'en_US';
  // If alternates provided, render exactly those; otherwise only render current page lang as alternate.
  const alt = alternates ?? ({ [lang]: fullUrl } as { [k: string]: string });
  const xDefaultHref = alternates?.en || `${base}/`;

  return (
    <Helmet>
      {/* HTML lang */}
      <html lang={lang} />

      {/* Primary */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullUrl} />

      {/* Hreflang alternates */}
      {Object.entries(alt).map(([hl, href]) => (
        <link key={hl} rel="alternate" hrefLang={hl} href={href} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={xDefaultHref} />

      {/* Open Graph */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={ogImage} />
      {ogImageAlt && <meta property="og:image:alt" content={ogImageAlt} />}
      <meta property="og:locale" content={locale} />
      <meta property="og:locale:alternate" content="en_US" />
      <meta property="og:locale:alternate" content="zh_CN" />
      <meta property="og:locale:alternate" content="fr_FR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {twitterSite && <meta name="twitter:site" content={twitterSite} />}
      {twitterCreator && <meta name="twitter:creator" content={twitterCreator} />}

      {/* Robots */}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="author" content={siteName} />
    </Helmet>
  );
}

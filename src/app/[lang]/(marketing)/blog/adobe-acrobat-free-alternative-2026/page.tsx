import type { Metadata } from 'next';
import BlogPostContent from './BlogPostContent';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang || 'en';
  
  return {
    title: 'Adobe Acrobat Free Alternative 2026: Zero-Trust PDF Redaction Guide',
    description: 'Explore why client-side WASM redaction is the superior alternative to Adobe Acrobat. A technical guide on data privacy, software bloat, and zero-trust workflows.',
    alternates: {
      canonical: lang === 'en' ? 'https://secureredact.tech/blog/adobe-acrobat-free-alternative-2026' : `https://secureredact.tech/${lang}/blog/adobe-acrobat-free-alternative-2026`,
      languages: {
        'en': 'https://secureredact.tech/blog/adobe-acrobat-free-alternative-2026',
        'zh': 'https://secureredact.tech/zh/blog/adobe-acrobat-free-alternative-2026',
        'fr': 'https://secureredact.tech/fr/blog/adobe-acrobat-free-alternative-2026',
        'x-default': 'https://secureredact.tech/blog/adobe-acrobat-free-alternative-2026',
      },
    },
    openGraph: {
      title: 'Adobe Acrobat Free Alternative 2026: Zero-Trust PDF Redaction Guide',
      description: 'Explore why client-side WASM redaction is the superior alternative to Adobe Acrobat. A technical guide on data privacy, software bloat, and zero-trust workflows.',
      url: 'https://secureredact.tech/en/blog/adobe-acrobat-free-alternative-2026',
      type: 'article',
      publishedTime: '2026-01-27',
      authors: ['Engineering Team'],
      images: [
        {
          url: 'https://secureredact.tech/images/blog/adobe-acrobat-free-alternative-2026/visual_0.webp',
          width: 1200,
          height: 630,
          alt: 'Digital Data Persistence Visualization',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Adobe Acrobat Free Alternative 2026: Zero-Trust PDF Redaction Guide',
      description: 'Explore why client-side WASM redaction is the superior alternative to Adobe Acrobat. A technical guide on data privacy, software bloat, and zero-trust workflows.',
      images: ['https://secureredact.tech/images/blog/adobe-acrobat-free-alternative-2026/visual_0.webp'],
    },
  };
}

export default function Page({ params }: { params: { lang: string } }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'The Engineering Guide to Zero-Trust PDF Redaction: Optimization, Privacy, and Tool Selection',
    description: 'Explore why client-side WASM redaction is the superior alternative to Adobe Acrobat. A technical guide on data privacy, software bloat, and zero-trust workflows.',
    image: 'https://secureredact.tech/images/blog/adobe-acrobat-free-alternative-2026/visual_0.webp',
    datePublished: '2026-01-27',
    dateModified: '2026-01-27',
    author: {
      '@type': 'Organization',
      name: 'Engineering Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SecureRedact',
      logo: {
        '@type': 'ImageObject',
        url: 'https://secureredact.tech/favicon.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://secureredact.tech/en/blog/adobe-acrobat-free-alternative-2026',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostContent />
    </>
  );
}

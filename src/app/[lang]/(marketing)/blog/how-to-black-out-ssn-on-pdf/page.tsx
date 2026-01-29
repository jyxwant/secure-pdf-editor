import type { Metadata } from 'next';
import BlogPostContent from './BlogPostContent';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang || 'en';
  
  return {
    title: 'How to Black Out SSN on PDF: A Technical Guide | SecureRedact',
    description: 'Learn how to securely redact SSN from PDF documents. A technical guide on why black boxes fail and how to use client-side processing for GDPR/HIPAA compliance.',
    alternates: {
      canonical: lang === 'en' ? 'https://secureredact.tech/blog/how-to-black-out-ssn-on-pdf' : `https://secureredact.tech/${lang}/blog/how-to-black-out-ssn-on-pdf`,
      languages: {
        'en': 'https://secureredact.tech/blog/how-to-black-out-ssn-on-pdf',
        'zh': 'https://secureredact.tech/zh/blog/how-to-black-out-ssn-on-pdf',
        'fr': 'https://secureredact.tech/fr/blog/how-to-black-out-ssn-on-pdf',
        'x-default': 'https://secureredact.tech/blog/how-to-black-out-ssn-on-pdf',
      },
    },
    openGraph: {
      title: 'How to Black Out SSN on PDF: A Technical Guide | SecureRedact',
      description: 'Learn how to securely redact SSN from PDF documents. A technical guide on why black boxes fail and how to use client-side processing for GDPR/HIPAA compliance.',
      url: 'https://secureredact.tech/en/blog/how-to-black-out-ssn-on-pdf',
      type: 'article',
      publishedTime: '2026-01-26',
      authors: ['Security Team'],
      images: [
        {
          url: 'https://secureredact.tech/images/blog/how-to-black-out-ssn-on-pdf/visual_0.webp',
          width: 1200,
          height: 630,
          alt: 'PDF code structure visualization',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'How to Black Out SSN on PDF: A Technical Guide | SecureRedact',
      description: 'Learn how to securely redact SSN from PDF documents. A technical guide on why black boxes fail and how to use client-side processing for GDPR/HIPAA compliance.',
      images: ['https://secureredact.tech/images/blog/how-to-black-out-ssn-on-pdf/visual_0.webp'],
    },
  };
}

export default function Page({ params }: { params: { lang: string } }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'Architecting Secure Document Workflows: A Technical Guide to SSN Redaction',
    description: 'A technical guide on why black boxes fail and how to use client-side processing for GDPR/HIPAA compliance.',
    image: 'https://secureredact.tech/images/blog/how-to-black-out-ssn-on-pdf/visual_0.webp',
    datePublished: '2026-01-26',
    dateModified: '2026-01-26',
    author: {
      '@type': 'Organization',
      name: 'Security Team',
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
      '@id': 'https://secureredact.tech/en/blog/how-to-black-out-ssn-on-pdf',
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

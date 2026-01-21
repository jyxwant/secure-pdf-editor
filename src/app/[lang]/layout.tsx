import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import '../globals.css';
import I18nProvider from '@/components/I18nProvider';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'zh' }, { lang: 'fr' }];
}

export const metadata: Metadata = {
  title: 'Free PDF Redaction Tool - Secure Online PDF Editor | Remove Sensitive Data | SecureRedact',
  description: 'Free online PDF redaction tool that permanently removes sensitive information from PDF documents. Secure local processing, no uploads needed. Features pixelation, black-out redaction, and multi-language support for GDPR, HIPAA compliance.',
  keywords: 'PDF redaction tool, online PDF editor, secure PDF redaction, remove sensitive information PDF, PDF privacy tool, document redaction, GDPR PDF compliance, HIPAA PDF redaction, free PDF editor, local PDF processing, PDF security editor',
  authors: [{ name: 'SecureRedact' }],
  openGraph: {
    title: 'Free PDF Redaction Tool - Secure Online PDF Editor | SecureRedact',
    description: 'Free online PDF redaction tool that permanently removes sensitive information from PDF documents. Secure local processing, no uploads needed. Features pixelation, black-out redaction for GDPR, HIPAA compliance.',
    type: 'website',
    url: 'https://secureredact.tech/',
    siteName: 'SecureRedact - PDF Redaction Tool',
    images: [
      {
        url: 'https://secureredact.tech/og-image.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free PDF Redaction Tool - Secure Online PDF Editor',
    description: 'Free online PDF redaction tool that permanently removes sensitive information from PDF documents. Secure local processing, no uploads needed.',
  },
  alternates: {
    canonical: 'https://secureredact.tech/',
    languages: {
      'en': 'https://secureredact.tech/en',
      'zh': 'https://secureredact.tech/zh',
      'fr': 'https://secureredact.tech/fr',
      'x-default': 'https://secureredact.tech/',
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'><path d='M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z' fill='%232563eb'/><path d='M9 12L11 14L15 10' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>" },
    ],
  },
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={params.lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://vitals.vercel-analytics.com" />
        <link rel="dns-prefetch" href="//github.com" />
        <link rel="dns-prefetch" href="//vercel.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "SecureRedact - PDF Redaction Tool",
              "applicationCategory": "BusinessApplication",
              "applicationSubCategory": "Document Editor",
              "operatingSystem": "Web Browser",
              "url": "https://secureredact.tech",
              "description": "Free online PDF redaction tool that permanently removes sensitive information from PDF documents. Secure local processing with no uploads required.",
              "features": [
                "PDF Redaction",
                "Sensitive Information Removal", 
                "Local Processing",
                "Multi-language Support",
                "GDPR Compliance",
                "HIPAA Compliance"
              ],
              "browserRequirements": "Requires JavaScript enabled browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "SecureRedact",
                "url": "https://github.com/jyxwant/secure-pdf-editor"
              },
              "publisher": {
                "@type": "Organization", 
                "name": "SecureRedact",
                "url": "https://secureredact.tech"
              },
              "screenshot": "https://secureredact.tech/screenshot.png",
              "softwareVersion": "1.0.0",
              "datePublished": "2024-08-31",
              "dateModified": "2024-09-01",
              "license": "https://github.com/jyxwant/secure-pdf-editor/blob/main/LICENSE",
              "programmingLanguage": ["JavaScript", "TypeScript", "React"],
              "keywords": "PDF redaction, document privacy, sensitive data removal, GDPR compliance, HIPAA compliance, online PDF editor"
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <I18nProvider locale={params.lang}>
          {children}
          <Analytics />
          <SpeedInsights scriptSrc="https://secureredact.tech/_vercel/speed-insights/script.js" />
        </I18nProvider>
      </body>
    </html>
  );
}

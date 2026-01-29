import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import './globals.css';
import I18nProvider from '@/components/I18nProvider';
import { resources } from '@/i18n/resources';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  title: resources['en'].translation['meta.title.home'],
  description: resources['en'].translation['meta.desc.home'],
  keywords: 'PDF redaction tool, online PDF editor, secure PDF redaction, remove sensitive information PDF, PDF privacy tool, document redaction, GDPR PDF compliance, HIPAA PDF redaction, free PDF editor, local PDF processing, PDF security editor',
  authors: [{ name: 'SecureRedact' }],
  metadataBase: new URL('https://secureredact.tech'),
  openGraph: {
    title: resources['en'].translation['meta.title.home'],
    description: resources['en'].translation['meta.desc.home'],
    type: 'website',
    url: 'https://secureredact.tech',
    siteName: 'SecureRedact - PDF Redaction Tool',
    images: [
      {
        url: 'https://secureredact.tech/og-image.png',
      },
    ],
    locale: 'en',
  },
  twitter: {
    card: 'summary_large_image',
    title: resources['en'].translation['meta.title.home'],
    description: resources['en'].translation['meta.desc.home'],
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
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SecureRedact - PDF Redaction Tool",
    "url": "https://secureredact.tech",
    "description": resources['en'].translation['meta.desc.home'],
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
    "license": "https://github.com/jyxwant/secure-pdf-editor/blob/main/LICENSE",
    "keywords": "PDF redaction, document privacy, sensitive data removal, GDPR compliance, HIPAA compliance, online PDF editor",
    "inLanguage": "en"
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://vitals.vercel-analytics.com" />
        <link rel="dns-prefetch" href="//github.com" />
        <link rel="dns-prefetch" href="//vercel.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd)
          }}
        />
      </head>
      <body className={inter.className}>
        <I18nProvider locale="en">
          {children}
          <Analytics />
          <SpeedInsights scriptSrc="https://secureredact.tech/_vercel/speed-insights/script.js" />
        </I18nProvider>
      </body>
    </html>
  );
}

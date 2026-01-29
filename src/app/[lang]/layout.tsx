import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import '../globals.css';
import I18nProvider from '@/components/I18nProvider';
import { resources } from '@/i18n/resources';
import { headers } from 'next/headers';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'zh' }, { lang: 'fr' }];
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang || 'en';
  // @ts-ignore
  const t = resources[lang]?.translation || resources['en'].translation;
  
  // Construct canonical URL
  // We try to get the full URL from headers to ensure correct canonical and hreflang
  const headersList = headers();
  // Fallback host
  const host = headersList.get('host') || 'secureredact.tech';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  
  // In Next.js App Router, finding the current path in layout is tricky.
  // We use a best-effort approach. If x-url is present (middleware), use it.
  // Otherwise, we might default to the root of the lang if we can't determine subpath.
  // However, removing the WRONG canonical is the most important step.
  // If we can't determine the exact path, we should NOT set a canonical that points to home.
  // But we can construct the base.
  
  // Note: For a robust solution, one should use a Middleware to set 'x-url' header.
  // Assuming 'x-url' might not be there, we will construct the base URL based on lang.
  // But the user specifically complained about hardcoded canonical.
  // We will set metadataBase and allow pages to handle specific paths, 
  // BUT we must provide the hreflang for the current page if possible.
  
  // Let's try to get the path from x-invoke-path or x-url if available, or just use the domain root + lang
  // to fix the "points to home" issue at least for the home pages.
  // For subpages, if they don't override, they will inherit.
  
  // Ideally:
  // metadataBase: new URL('https://secureredact.tech'),
  // alternates: {
  //   canonical: `/${lang}`, // This is still pointing to lang root!
  // }
  
  // The correct fix for "Canonical points to home" on subpages is to NOT set 'canonical' in the root layout
  // unless we know the path.
  // So we will OMIT 'canonical' from the default export here, and let it be handled by pages or defaults.
  // Next.js default behavior: No canonical tag if not specified.
  // This is better than a wrong one.
  
  // However, for Hreflang, we want to link to the same page in other languages.
  // Without knowing the path, we can't generate correct hreflangs for subpages.
  // So we will only generate hreflangs that point to the root of each language IF we are at root?
  // No, that's dangerous.
  
  // STRATEGY: 
  // 1. Dynamic TDK (Title/Desc) - Solved by using `t`.
  // 2. JSON-LD - Dynamic based on lang.
  // 3. Canonical/Hreflang - Remove the hardcoded wrong ones.
  //    If we can detect we are at root, set them. If not, omit them to avoid "pointing to home".
  
  return {
    title: t['meta.title.home'],
    description: t['meta.desc.home'],
    keywords: 'PDF redaction tool, online PDF editor, secure PDF redaction, remove sensitive information PDF, PDF privacy tool, document redaction, GDPR PDF compliance, HIPAA PDF redaction, free PDF editor, local PDF processing, PDF security editor',
    authors: [{ name: 'SecureRedact' }],
    metadataBase: new URL('https://secureredact.tech'),
    openGraph: {
      title: t['meta.title.home'],
      description: t['meta.desc.home'],
      type: 'website',
      url: `https://secureredact.tech/${lang}`,
      siteName: 'SecureRedact - PDF Redaction Tool',
      images: [
        {
          url: 'https://secureredact.tech/og-image.png',
        },
      ],
      locale: lang,
    },
    twitter: {
      card: 'summary_large_image',
      title: t['meta.title.home'],
      description: t['meta.desc.home'],
    },
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'><path d='M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z' fill='%232563eb'/><path d='M9 12L11 14L15 10' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>" },
      ],
    },
    // We intentionally OMIT alternates here to prevent the "All pages point to Home" bug.
    // Pages should define their own canonicals if needed, or we implement a middleware solution later.
    // For now, removing the harmful hardcoded values is the P0 fix.
  };
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const lang = params.lang || 'en';
  // @ts-ignore
  const t = resources[lang]?.translation || resources['en'].translation;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "SecureRedact - PDF Redaction Tool",
    "applicationCategory": "BusinessApplication",
    "applicationSubCategory": "Document Editor",
    "operatingSystem": "Web Browser",
    "url": `https://secureredact.tech/${lang}`,
    "description": t['meta.desc.home'], // Dynamic description
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
    "keywords": "PDF redaction, document privacy, sensitive data removal, GDPR compliance, HIPAA compliance, online PDF editor",
    "inLanguage": lang // Add language to JSON-LD
  };

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
            __html: JSON.stringify(jsonLd)
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

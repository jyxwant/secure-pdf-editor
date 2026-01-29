import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import '../../globals.css';
import I18nProvider from '@/components/I18nProvider';
import MarketingLayout from '@/components/MarketingLayout';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export default function BlogRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = 'zh';

  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://vitals.vercel-analytics.com" />
        <link rel="dns-prefetch" href="//github.com" />
        <link rel="dns-prefetch" href="//vercel.com" />
      </head>
      <body className={inter.className}>
        <I18nProvider locale={lang}>
          <MarketingLayout>
            {children}
          </MarketingLayout>
          <Analytics />
          <SpeedInsights scriptSrc="https://secureredact.tech/_vercel/speed-insights/script.js" />
        </I18nProvider>
      </body>
    </html>
  );
}

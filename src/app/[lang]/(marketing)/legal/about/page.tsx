import { Metadata } from 'next';
import AboutClient from './AboutClient';
import { resources } from '@/i18n/resources';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang || 'en';
  // @ts-ignore
  const t = resources[lang]?.translation || resources['en'].translation;

  return {
    title: t['legal.about.title'],
    description: t['legal.about.intro'],
    alternates: {
      canonical: lang === 'en' ? 'https://secureredact.tech/legal/about' : `https://secureredact.tech/${lang}/legal/about`,
      languages: {
        'en': 'https://secureredact.tech/legal/about',
        'zh': 'https://secureredact.tech/zh/legal/about',
        'fr': 'https://secureredact.tech/fr/legal/about',
        'x-default': 'https://secureredact.tech/legal/about',
      },
    },
  };
}

export default function AboutPage() {
  return <AboutClient />;
}

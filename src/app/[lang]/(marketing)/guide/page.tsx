import { Metadata } from 'next';
import GuideClient from './GuideClient';
import { resources } from '@/i18n/resources';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang || 'en';
  // @ts-ignore
  const t = resources[lang]?.translation || resources['en'].translation;

  return {
    title: `${t['guide.title']} - ${t['guide.subtitle']}`,
    description: t['guide.subtitle'],
    alternates: {
      canonical: `https://secureredact.tech/${lang}/guide`,
      languages: {
        'en': 'https://secureredact.tech/en/guide',
        'zh': 'https://secureredact.tech/zh/guide',
        'fr': 'https://secureredact.tech/fr/guide',
        'x-default': 'https://secureredact.tech/en/guide',
      },
    },
  };
}

export default function GuidePage() {
  return <GuideClient />;
}

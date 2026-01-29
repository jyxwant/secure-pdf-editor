import { Metadata } from 'next';
import FeaturesClient from './FeaturesClient';
import { resources } from '@/i18n/resources';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang || 'en';
  // @ts-ignore
  const t = resources[lang]?.translation || resources['en'].translation;

  return {
    title: `${t['features.title']} - ${t['features.subtitle']}`,
    description: t['features.localProcessing.description'],
    alternates: {
      canonical: `https://secureredact.tech/${lang}/features`,
      languages: {
        'en': 'https://secureredact.tech/en/features',
        'zh': 'https://secureredact.tech/zh/features',
        'fr': 'https://secureredact.tech/fr/features',
      },
    },
  };
}

export default function FeaturesPage() {
  return <FeaturesClient />;
}

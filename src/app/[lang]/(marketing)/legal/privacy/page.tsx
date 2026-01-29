import { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';
import { resources } from '@/i18n/resources';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang || 'en';
  // @ts-ignore
  const t = resources[lang]?.translation || resources['en'].translation;

  return {
    title: t['legal.privacy.title'],
    description: t['legal.privacy.collection.content'],
    alternates: {
      canonical: lang === 'en' ? 'https://secureredact.tech/legal/privacy' : `https://secureredact.tech/${lang}/legal/privacy`,
      languages: {
        'en': 'https://secureredact.tech/legal/privacy',
        'zh': 'https://secureredact.tech/zh/legal/privacy',
        'fr': 'https://secureredact.tech/fr/legal/privacy',
        'x-default': 'https://secureredact.tech/legal/privacy',
      },
    },
  };
}

export default function PrivacyPage() {
  return <PrivacyClient />;
}

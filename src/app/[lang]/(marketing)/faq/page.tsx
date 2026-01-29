import { Metadata } from 'next';
import FaqClient from './FaqClient';
import { resources } from '@/i18n/resources';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang || 'en';
  // @ts-ignore
  const t = resources[lang]?.translation || resources['en'].translation;

  return {
    title: `${t['faq.title']} - ${t['faq.subtitle']}`,
    description: t['faq.whatIsRedaction.answer'],
    alternates: {
      canonical: `https://secureredact.tech/${lang}/faq`,
      languages: {
        'en': 'https://secureredact.tech/en/faq',
        'zh': 'https://secureredact.tech/zh/faq',
        'fr': 'https://secureredact.tech/fr/faq',
      },
    },
  };
}

export default function FaqPage() {
  return <FaqClient />;
}

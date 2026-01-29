import { Metadata } from 'next';
import TermsClient from './TermsClient';
import { resources } from '@/i18n/resources';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang || 'en';
  // @ts-ignore
  const t = resources[lang]?.translation || resources['en'].translation;

  return {
    title: t['legal.terms.title'],
    description: t['legal.terms.acceptance.content'],
    alternates: {
      canonical: `https://secureredact.tech/${lang}/legal/terms`,
      languages: {
        'en': 'https://secureredact.tech/en/legal/terms',
        'zh': 'https://secureredact.tech/zh/legal/terms',
        'fr': 'https://secureredact.tech/fr/legal/terms',
      },
    },
  };
}

export default function TermsPage() {
  return <TermsClient />;
}

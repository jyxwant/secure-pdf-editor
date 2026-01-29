import { Metadata } from 'next';
import TermsClient from '../../../[lang]/(marketing)/legal/terms/TermsClient';
import { resources } from '@/i18n/resources';

const t = resources['en'].translation;

export const metadata: Metadata = {
  title: t['legal.terms.title'],
  description: t['legal.terms.acceptance.content'],
  alternates: {
    canonical: 'https://secureredact.tech/legal/terms',
    languages: {
      'en': 'https://secureredact.tech/legal/terms',
      'zh': 'https://secureredact.tech/zh/legal/terms',
      'fr': 'https://secureredact.tech/fr/legal/terms',
      'x-default': 'https://secureredact.tech/legal/terms',
    },
  },
};

export default function TermsPage() {
  return <TermsClient />;
}

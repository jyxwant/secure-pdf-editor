import { Metadata } from 'next';
import GuideClient from '../../[lang]/(marketing)/guide/GuideClient';
import { resources } from '@/i18n/resources';

const t = resources['en'].translation;

export const metadata: Metadata = {
  title: `${t['guide.title']} - ${t['guide.subtitle']}`,
  description: t['guide.subtitle'],
  alternates: {
    canonical: 'https://secureredact.tech/guide',
    languages: {
      'en': 'https://secureredact.tech/guide',
      'zh': 'https://secureredact.tech/zh/guide',
      'fr': 'https://secureredact.tech/fr/guide',
      'x-default': 'https://secureredact.tech/guide',
    },
  },
};

export default function GuidePage() {
  return <GuideClient />;
}

import { Metadata } from 'next';
import FeaturesClient from '../../[lang]/(marketing)/features/FeaturesClient';
import { resources } from '@/i18n/resources';

const t = resources['en'].translation;

export const metadata: Metadata = {
  title: `${t['features.title']} - ${t['features.subtitle']}`,
  description: t['features.localProcessing.description'],
  alternates: {
    canonical: 'https://secureredact.tech/features',
    languages: {
      'en': 'https://secureredact.tech/features',
      'zh': 'https://secureredact.tech/zh/features',
      'fr': 'https://secureredact.tech/fr/features',
      'x-default': 'https://secureredact.tech/features',
    },
  },
};

export default function FeaturesPage() {
  return <FeaturesClient />;
}

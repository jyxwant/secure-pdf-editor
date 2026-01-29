import { Metadata } from 'next';
import PrivacyClient from '../../../[lang]/(marketing)/legal/privacy/PrivacyClient';
import { resources } from '@/i18n/resources';

const t = resources['en'].translation;

export const metadata: Metadata = {
  title: t['legal.privacy.title'],
  description: t['legal.privacy.collection.content'],
  alternates: {
    canonical: 'https://secureredact.tech/legal/privacy',
    languages: {
      'en': 'https://secureredact.tech/legal/privacy',
      'zh': 'https://secureredact.tech/zh/legal/privacy',
      'fr': 'https://secureredact.tech/fr/legal/privacy',
      'x-default': 'https://secureredact.tech/legal/privacy',
    },
  },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}

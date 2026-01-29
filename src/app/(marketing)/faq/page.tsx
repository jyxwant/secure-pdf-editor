import { Metadata } from 'next';
import FaqClient from '../../[lang]/(marketing)/faq/FaqClient';
import { resources } from '@/i18n/resources';

const t = resources['en'].translation;

export const metadata: Metadata = {
  title: `${t['faq.title']} - ${t['faq.subtitle']}`,
  description: t['faq.whatIsRedaction.answer'],
  alternates: {
    canonical: 'https://secureredact.tech/faq',
    languages: {
      'en': 'https://secureredact.tech/faq',
      'zh': 'https://secureredact.tech/zh/faq',
      'fr': 'https://secureredact.tech/fr/faq',
      'x-default': 'https://secureredact.tech/faq',
    },
  },
};

export default function FaqPage() {
  return <FaqClient />;
}

import { Metadata } from 'next';
import AboutClient from '../../[lang]/(marketing)/legal/about/AboutClient';
import { resources } from '@/i18n/resources';

const t = resources['en'].translation;

export const metadata: Metadata = {
  title: t['legal.about.title'],
  description: t['legal.about.intro'],
  alternates: {
    canonical: 'https://secureredact.tech/legal/about',
    languages: {
      'en': 'https://secureredact.tech/legal/about',
      'zh': 'https://secureredact.tech/zh/legal/about',
      'fr': 'https://secureredact.tech/fr/legal/about',
      'x-default': 'https://secureredact.tech/legal/about',
    },
  },
};

export default function AboutPage() {
  return <AboutClient />;
}

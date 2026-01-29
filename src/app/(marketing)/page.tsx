import LandingPage from '../[lang]/(marketing)/LandingPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://secureredact.tech',
    languages: {
      'en': 'https://secureredact.tech',
      'zh': 'https://secureredact.tech/zh',
      'fr': 'https://secureredact.tech/fr',
      'x-default': 'https://secureredact.tech',
    }
  }
};

export default function Page() {
  return <LandingPage />;
}

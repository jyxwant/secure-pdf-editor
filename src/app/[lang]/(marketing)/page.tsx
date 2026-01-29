import LandingPage from './LandingPage';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang || 'en';
  return {
    alternates: {
      canonical: lang === 'en' ? 'https://secureredact.tech' : `https://secureredact.tech/${lang}`,
      languages: {
        'en': 'https://secureredact.tech',
        'zh': 'https://secureredact.tech/zh',
        'fr': 'https://secureredact.tech/fr',
        'x-default': 'https://secureredact.tech',
      }
    }
  };
}

export default function Page() {
  return <LandingPage />;
}

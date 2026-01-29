import { Metadata } from 'next';
import Client from './Client';
import { resources } from '@/i18n/resources';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang || 'en';
  // @ts-ignore
  const t = resources[lang]?.translation || resources['en'].translation;

  return {
    title: t['blog.post1.title'],
    description: t['blog.post1.excerpt'],
    alternates: {
      canonical: lang === 'en' ? 'https://secureredact.tech/blog/how-to-redact-pdf' : `https://secureredact.tech/${lang}/blog/how-to-redact-pdf`,
      languages: {
        'en': 'https://secureredact.tech/blog/how-to-redact-pdf',
        'zh': 'https://secureredact.tech/zh/blog/how-to-redact-pdf',
        'fr': 'https://secureredact.tech/fr/blog/how-to-redact-pdf',
        'x-default': 'https://secureredact.tech/blog/how-to-redact-pdf',
      },
    },
  };
}

export default function Page({ params }: { params: { lang: string } }) {
  return <Client />;
}

import { Metadata } from 'next';
import Client from './Client';
import { resources } from '@/i18n/resources';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang || 'en';
  // @ts-ignore
  const t = resources[lang]?.translation || resources['en'].translation;

  return {
    title: t['blog.post2.title'],
    description: t['blog.post2.excerpt'],
    alternates: {
      canonical: lang === 'en' ? 'https://secureredact.tech/blog/redact-pdf-free' : `https://secureredact.tech/${lang}/blog/redact-pdf-free`,
      languages: {
        'en': 'https://secureredact.tech/blog/redact-pdf-free',
        'zh': 'https://secureredact.tech/zh/blog/redact-pdf-free',
        'fr': 'https://secureredact.tech/fr/blog/redact-pdf-free',
        'x-default': 'https://secureredact.tech/blog/redact-pdf-free',
      },
    },
  };
}

export default function Page({ params }: { params: { lang: string } }) {
  return <Client />;
}

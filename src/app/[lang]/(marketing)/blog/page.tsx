import { Metadata } from 'next';
import BlogClient from './BlogClient';
import { resources } from '@/i18n/resources';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang || 'en';
  // @ts-ignore
  const t = resources[lang]?.translation || resources['en'].translation;

  return {
    title: t['meta.title.blog'],
    description: t['blog.subtitle'],
    alternates: {
      canonical: `https://secureredact.tech/${lang}/blog`,
      languages: {
        'en': 'https://secureredact.tech/en/blog',
        'zh': 'https://secureredact.tech/zh/blog',
        'fr': 'https://secureredact.tech/fr/blog',
      },
    },
  };
}

export default function BlogPage() {
  return <BlogClient />;
}

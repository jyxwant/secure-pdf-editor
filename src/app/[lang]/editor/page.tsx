import { Metadata } from 'next';
import EditorClient from './EditorClient';
import { resources } from '@/i18n/resources';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang || 'en';
  // @ts-ignore
  const t = resources[lang]?.translation || resources['en'].translation;

  return {
    title: t['meta.title.editor'],
    description: t['upload.description'],
    alternates: {
      canonical: lang === 'en' ? 'https://secureredact.tech/editor' : `https://secureredact.tech/${lang}/editor`,
      languages: {
        'en': 'https://secureredact.tech/editor',
        'zh': 'https://secureredact.tech/zh/editor',
        'fr': 'https://secureredact.tech/fr/editor',
        'x-default': 'https://secureredact.tech/editor',
      },
    },
  };
}

export default function EditorPage() {
  return <EditorClient />;
}

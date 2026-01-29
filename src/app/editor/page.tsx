import { Metadata } from 'next';
import EditorClient from '../[lang]/editor/EditorClient';
import { resources } from '@/i18n/resources';

const t = resources['en'].translation;

export const metadata: Metadata = {
  title: t['meta.title.editor'],
  description: t['upload.description'],
  alternates: {
    canonical: 'https://secureredact.tech/editor',
    languages: {
      'en': 'https://secureredact.tech/editor',
      'zh': 'https://secureredact.tech/zh/editor',
      'fr': 'https://secureredact.tech/fr/editor',
      'x-default': 'https://secureredact.tech/editor',
    },
  },
};

export default function EditorPage() {
  return <EditorClient />;
}

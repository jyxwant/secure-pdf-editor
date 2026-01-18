'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Features } from '@/components/SEO/Features';

export default function FeaturesPage() {
  const { t } = useTranslation();
  return (
    <div className="py-12 bg-[#f0f0f0] min-h-[calc(100vh-64px-200px)]">
      <div className="max-w-4xl mx-auto px-6 mb-12 text-center">
        <div className="inline-block px-8 py-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-3xl font-black text-black uppercase tracking-wide m-0">{t('features.title')}</h1>
        </div>
      </div>
      <Features />
    </div>
  );
}

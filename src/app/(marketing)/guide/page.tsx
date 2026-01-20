'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserGuide } from '@/components/SEO/UserGuide';

export default function GuidePage() {
  // Page component for /guide route
  const { t } = useTranslation();
  return (
    <div className="py-12 bg-[#f0f0f0] min-h-[calc(100vh-64px-200px)]">
      <div className="max-w-4xl mx-auto px-6 mb-12 text-center">
        <div className="inline-block px-8 py-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-3xl font-black text-black uppercase tracking-wide m-0">{t('guide.title')}</h1>
        </div>
      </div>
      <UserGuide />
    </div>
  );
}

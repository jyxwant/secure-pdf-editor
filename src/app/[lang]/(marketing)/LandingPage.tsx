'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Shield, ArrowRight, Zap, Lock } from 'lucide-react';
import { Features } from '@/components/SEO/Features';
import { UserGuide } from '@/components/SEO/UserGuide';
import { FAQ } from '@/components/SEO/FAQ';

export default function LandingPage() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  return (
    <div className="flex flex-col min-h-screen bg-[#f0f0f0]">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full z-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-20 right-10 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-32 h-32 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-2 mb-8 neo-box-sm rounded-full bg-white">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-black text-white rounded-full mr-2">
              {t('hero.newBadge')}
            </span>
            <span className="text-sm font-bold text-gray-900">
              {t('hero.newBadgeDesc')}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight mb-6 leading-tight">
            {t('hero.title.line1')} <br/>
            <span className="relative inline-block">
              <span className="relative z-10 text-blue-600">{t('hero.title.securely')}</span>
              <span className="absolute bottom-2 left-0 w-full h-4 bg-yellow-300 -z-0 transform -rotate-1"></span>
            </span>
            &nbsp;{t('hero.title.inBrowser')}
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 font-medium">
            {t('hero.description')}
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Link
              href={currentLang === 'en' ? '/editor' : `/${currentLang}/editor`}
              className="neo-button group inline-flex items-center px-8 py-3 text-lg font-bold bg-[#ff6b6b] text-white hover:bg-[#ff5252] transform hover:-translate-y-1 transition-all"
            >
              {t('hero.startRedacting')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#features"
              className="neo-button bg-white text-gray-900 px-8 py-3 text-lg font-bold hover:bg-gray-50 transition-all"
            >
              {t('hero.learnMore')}
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="neo-card p-6 bg-white text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">{t('hero.stats.secure')}</h3>
              <p className="text-gray-600">{t('hero.stats.secureDesc')}</p>
            </div>
            <div className="neo-card p-6 bg-white text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">{t('hero.stats.fast')}</h3>
              <p className="text-gray-600">{t('hero.stats.fastDesc')}</p>
            </div>
            <div className="neo-card p-6 bg-white text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black">
                <Lock className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">{t('hero.stats.true')}</h3>
              <p className="text-gray-600">{t('hero.stats.trueDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* User Guide Section */}
      <UserGuide />

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <section className="py-20 bg-black text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-6">
            {t('hero.cta.title')}
          </h2>
          <Link
            href={currentLang === 'en' ? '/editor' : `/${currentLang}/editor`}
            className="neo-button inline-flex items-center px-8 py-4 text-xl font-bold bg-[#4ecdc4] text-black hover:bg-[#45b7af] transform hover:-translate-y-1 transition-all"
          >
            {t('hero.cta.button')}
            <ArrowRight className="ml-2 w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  );
}

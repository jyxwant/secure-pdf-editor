'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FAQ } from '@/components/SEO/FAQ';

const AuthorBox: React.FC<{ author: string, date: string, reviewer?: string }> = ({ author, date, reviewer }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between text-sm text-gray-600 mb-8 pb-8 border-b-2 border-gray-100">
      <div className="flex items-center space-x-6 mb-4 md:mb-0">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-black flex items-center justify-center mr-3">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">{t('blog.author')}</p>
            <p className="font-bold text-black">{author}</p>
          </div>
        </div>
        {reviewer && (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-100 border-2 border-black flex items-center justify-center mr-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">{t('blog.reviewedBy')}</p>
              <p className="font-bold text-black">{reviewer}</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center font-medium bg-gray-50 px-3 py-1 rounded border border-gray-200">
        <Calendar className="w-4 h-4 mr-2" />
        {t('blog.publishedOn')}: {date}
      </div>
    </div>
  );
};

export default function BlogPost1() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 bg-white min-h-screen">
      <Link href={`/${currentLang}/blog`} className="inline-flex items-center text-gray-600 hover:text-black mb-8 font-bold group">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> {t('blog.backToBlog')}
      </Link>
      
      <article className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-black prose-a:text-blue-600 prose-p:text-gray-700 prose-p:font-medium">
        <h1 className="text-4xl md:text-5xl mb-6">{t('blog.post1.title')}</h1>
        
        <AuthorBox 
          author="Security Team" 
          date="Jan 15, 2026" 
          reviewer="Dr. Privacy (PhD)"
        />

        <div className="bg-gray-100 p-8 mb-8 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-center text-gray-500 italic font-medium">
            [Image Placeholder: A visual diagram showing the difference between masking and true redaction]
          </div>
        </div>

        <p className="lead text-xl">
          {t('blog.post1.content.lead')}
        </p>

        <h2>{t('blog.post1.content.h1')}</h2>
        <p>
          {t('blog.post1.content.p1')}
        </p>
        <p>
          For a deeper dive into data privacy, you can read about <a href="https://gdpr.eu/what-is-gdpr/" target="_blank" rel="nofollow noreferrer">GDPR compliance standards</a>.
        </p>

        <h2>{t('blog.post1.content.h2')}</h2>
        <p>
          {t('blog.post1.content.p2')}
        </p>
        <ol className="list-decimal pl-6 space-y-4">
          <li>
            <strong>{t('blog.post1.content.step1.title')}:</strong> {t('blog.post1.content.step1.desc')}
          </li>
          <li>
            <strong>{t('blog.post1.content.step2.title')}:</strong> {t('blog.post1.content.step2.desc')}
          </li>
          <li>
            <strong>{t('blog.post1.content.step3.title')}:</strong> {t('blog.post1.content.step3.desc')}
          </li>
          <li>
            <strong>{t('blog.post1.content.step4.title')}:</strong> {t('blog.post1.content.step4.desc')}
          </li>
        </ol>

        <h2>{t('blog.post1.content.h3')}</h2>
        <p>
          {t('blog.post1.content.p3')}
        </p>

        <div className="bg-yellow-50 p-6 border-l-4 border-black my-8">
          <h3 className="mt-0 text-black">{t('blog.post1.content.tip.title')}</h3>
          <p className="mb-0">
            {t('blog.post1.content.tip.desc')}
          </p>
        </div>
      </article>

      {/* Blog Specific FAQ */}
      <div className="mt-16 pt-8 border-t-2 border-black">
        <h3 className="text-2xl font-black mb-6">{t('blog.faq.title')}</h3>
        <FAQ />
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, User, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function BlogPage() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  
  const basePosts = [
    {
      id: 'how-to-redact-pdf',
      title: t('blog.post1.title'),
      excerpt: t('blog.post1.excerpt'),
      date: 'Jan 15, 2026',
      author: 'Security Team',
      tags: ['Tutorial', 'Security']
    },
    {
      id: 'redact-pdf-free',
      title: t('blog.post2.title'),
      excerpt: t('blog.post2.excerpt'),
      date: 'Jan 10, 2026',
      author: 'Editor',
      tags: ['Comparison', 'Tools']
    }
  ];

  const posts = [...basePosts];

  // Add English-only technical post
  if (currentLang === 'en') {
    posts.unshift({
      id: 'how-to-black-out-ssn-on-pdf',
      title: 'Architecting Secure Document Workflows: A Technical Guide to SSN Redaction',
      excerpt: 'A technical deep-dive into why standard redaction fails and how WebAssembly enables true data sanitization in the browser.',
      date: 'Jan 26, 2026',
      author: 'Security Team',
      tags: ['Technical', 'Deep Dive']
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 bg-white min-h-screen">
      <h1 className="text-5xl font-black text-black mb-4 uppercase tracking-tight">{t('blog.title')}</h1>
      <p className="text-xl text-gray-600 mb-12 font-bold">{t('blog.subtitle')}</p>
      
      <div className="grid gap-12">
        {posts.map(post => (
          <article key={post.id} className="neo-box p-8 hover:translate-x-1 hover:translate-y-1 transition-transform bg-white relative overflow-hidden">
             <div className="absolute top-0 right-0 bg-yellow-300 px-4 py-1 border-l-2 border-b-2 border-black font-bold text-xs uppercase">
               {post.tags[0]}
             </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center font-bold"><Calendar className="w-4 h-4 mr-1" /> {post.date}</span>
              <span className="flex items-center font-bold"><User className="w-4 h-4 mr-1" /> {post.author}</span>
            </div>
            <h2 className="text-3xl font-black mb-4">
              <Link href={`/${currentLang}/blog/${post.id}`} className="text-black hover:text-blue-600 transition-colors">
                {post.title}
              </Link>
            </h2>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed font-medium">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <Link 
                href={`/${currentLang}/blog/${post.id}`} 
                className="neo-btn-sm bg-black text-white hover:bg-gray-800"
              >
                {t('blog.readArticle')}
              </Link>
              <div className="flex space-x-2">
                {post.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-xs font-bold uppercase border border-black">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

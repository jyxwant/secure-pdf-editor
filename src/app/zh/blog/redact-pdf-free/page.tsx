import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, CheckCircle } from 'lucide-react';
import { resources } from '@/i18n/resources';
import { FAQ } from '@/components/SEO/FAQ';

const t = resources.zh.translation;

export const metadata: Metadata = {
  title: t['blog.post2.title'],
  description: t['blog.post2.excerpt'],
  alternates: {
    canonical: 'https://secureredact.tech/zh/blog/redact-pdf-free',
    languages: {
      'en': 'https://secureredact.tech/blog/redact-pdf-free',
      'zh': 'https://secureredact.tech/zh/blog/redact-pdf-free',
      'fr': 'https://secureredact.tech/fr/blog/redact-pdf-free',
      'x-default': 'https://secureredact.tech/blog/redact-pdf-free',
    },
  },
};

const AuthorBox = ({ author, date, reviewer }: { author: string, date: string, reviewer?: string }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between text-sm text-gray-600 mb-8 pb-8 border-b-2 border-gray-100">
      <div className="flex items-center space-x-6 mb-4 md:mb-0">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-black flex items-center justify-center mr-3">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">{t['blog.author']}</p>
            <p className="font-bold text-black">{author}</p>
          </div>
        </div>
        {reviewer && (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-100 border-2 border-black flex items-center justify-center mr-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">{t['blog.reviewedBy']}</p>
              <p className="font-bold text-black">{reviewer}</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center font-medium bg-gray-50 px-3 py-1 rounded border border-gray-200">
        <Calendar className="w-4 h-4 mr-2" />
        {t['blog.publishedOn']}: {date}
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 bg-white min-h-screen">
      <Link href="/zh/blog" className="inline-flex items-center text-gray-600 hover:text-black mb-8 font-bold group">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> {t['blog.backToBlog']}
      </Link>
      
      <article className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-black prose-a:text-blue-600 prose-p:text-gray-700 prose-p:font-medium">
        <h1 className="text-4xl md:text-5xl mb-6">{t['blog.post2.title']}</h1>
        
        <AuthorBox 
          author="Editor" 
          date="2026年1月10日" 
          reviewer="Tech Lead"
        />

        <p className="lead text-xl">
          {t['blog.post2.content.lead']}
        </p>

        <h2>{t['blog.post2.content.h1']}</h2>
        <p>
          {t['blog.post2.content.p1']}
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>{t['blog.post2.content.p1.pros']}</li>
          <li>{t['blog.post2.content.p1.cons']}</li>
        </ul>

        <h2>{t['blog.post2.content.h2']}</h2>
        <p>
          {t['blog.post2.content.p2']}
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>{t['blog.post2.content.p2.pros']}</li>
          <li>{t['blog.post2.content.p2.cons']}</li>
        </ul>

        <div className="bg-gray-100 p-8 mb-8 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-center text-gray-500 italic font-medium">
            [图片占位符：不同PDF工具对比表]
          </div>
        </div>

        <h2>{t['blog.post2.content.h3']}</h2>
        <p>
          {t['blog.post2.content.p3']}
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>{t['blog.post2.content.p3.pros']}</li>
          <li>{t['blog.post2.content.p3.cons']}</li>
        </ul>

        <h2>{t['blog.post2.content.conclusion']}</h2>
        <p>
          {t['blog.post2.content.conclusion.desc']}
        </p>
      </article>
      
      {/* Blog Specific FAQ */}
      <div className="mt-16 pt-8 border-t-2 border-black">
        <h3 className="text-2xl font-black mb-6">{t['blog.faq.title']}</h3>
        <FAQ />
      </div>
    </div>
  );
}

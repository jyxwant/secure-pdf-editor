'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const [openItems, setOpenItems] = useState<number[]>([0]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqItems: FAQItem[] = [
    {
      question: t('faq.whatIsRedaction.question'),
      answer: t('faq.whatIsRedaction.answer')
    },
    {
      question: t('faq.howSecure.question'),
      answer: t('faq.howSecure.answer')
    },
    {
      question: t('faq.fileSize.question'),
      answer: t('faq.fileSize.answer')
    },
    {
      question: t('faq.browserSupport.question'),
      answer: t('faq.browserSupport.answer')
    },
    {
      question: t('faq.redactionMethods.question'),
      answer: t('faq.redactionMethods.answer')
    },
    {
      question: t('faq.compliance.question'),
      answer: t('faq.compliance.answer')
    },
    {
      question: t('faq.multiLanguage.question'),
      answer: t('faq.multiLanguage.answer')
    },
    {
      question: t('faq.cost.question'),
      answer: t('faq.cost.answer')
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-black mb-4 uppercase tracking-tight">
            {t('faq.title')}
          </h2>
          <div className="w-24 h-2 bg-blue-400 mx-auto border-2 border-black mb-6"></div>
          <p className="text-xl text-gray-700 font-bold">
            {t('faq.subtitle')}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="neo-box bg-white overflow-hidden">
              <button
                onClick={() => toggleItem(index)}
                className={`w-full px-6 py-4 text-left flex items-center justify-between transition-colors duration-150 ${
                  openItems.includes(index) ? 'bg-yellow-100 border-b-2 border-black' : 'hover:bg-gray-50'
                }`}
              >
                <h3 className="text-base font-black text-black pr-6 leading-relaxed uppercase">
                  {item.question}
                </h3>
                <div className="flex-shrink-0 border-2 border-black p-1 bg-white">
                  {openItems.includes(index) ? (
                    <ChevronUp className="w-4 h-4 text-black" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-black" />
                  )}
                </div>
              </button>
              
              {openItems.includes(index) && (
                <div className="px-6 py-6 bg-white">
                  <p className="text-base text-gray-800 font-medium leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 pt-8">
          <Link 
            href={`/${currentLang}/editor`}
            className="neo-btn bg-black text-white hover:bg-gray-800 inline-flex items-center text-lg px-8 py-3"
          >
            {t('faq.cta.button')}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

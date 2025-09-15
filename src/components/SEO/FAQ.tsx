import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ: React.FC = () => {
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState<number[]>([0]); // First item open by default

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
      <div className="max-w-3xl mx-auto px-6">
        {/* Header - 简洁标题 */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            {t('faq.title')}
          </h2>
          <p className="text-gray-600 text-sm">
            {t('faq.subtitle')}
          </p>
        </div>

        {/* FAQ Items - 极简设计 */}
        <div className="space-y-0 border-t border-gray-100">
          {faqItems.map((item, index) => (
            <div key={index} className="border-b border-gray-100">
              <button
                onClick={() => toggleItem(index)}
                className="w-full py-6 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors duration-150"
              >
                <h3 className="text-sm font-medium text-gray-900 pr-6 leading-relaxed">
                  {item.question}
                </h3>
                <div className="flex-shrink-0">
                  {openItems.includes(index) ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </button>
              
              {openItems.includes(index) && (
                <div className="pb-6 -mt-2">
                  <p className="text-sm text-gray-600 leading-relaxed pl-0">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action - 极简按钮 */}
        <div className="text-center mt-12 pt-8">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-150"
          >
            {t('faq.cta.button')}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};
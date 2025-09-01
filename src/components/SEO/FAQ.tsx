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
    <section className="py-12 bg-white" id="faq">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('faq.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div 
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors duration-200"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {item.question}
                </h3>
                {openItems.includes(index) ? (
                  <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              
              {openItems.includes(index) && (
                <div className="px-6 pb-4 bg-gray-50 border-t border-gray-100">
                  <p className="text-gray-700 leading-relaxed pt-4">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-10 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            {t('faq.cta.title')}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('faq.cta.description')}
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
          >
            {t('faq.cta.button')}
          </button>
        </div>
      </div>
    </section>
  );
};
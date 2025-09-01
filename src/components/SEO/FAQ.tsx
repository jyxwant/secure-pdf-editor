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
      question: t('faq.whatIsRedaction.question', 'What is PDF redaction and why is it important?'),
      answer: t('faq.whatIsRedaction.answer', 'PDF redaction is the process of permanently removing sensitive information from PDF documents. Unlike simple deletion or covering text with shapes, true redaction completely removes the underlying data, making it impossible to recover. This is crucial for GDPR, HIPAA compliance, and protecting personal information in legal, healthcare, and business documents.')
    },
    {
      question: t('faq.howSecure.question', 'How secure is your PDF redaction tool?'),
      answer: t('faq.howSecure.answer', 'Our tool processes all PDF files locally in your browser - no files are ever uploaded to our servers. This means your sensitive documents never leave your computer, providing maximum privacy and security. We use advanced PDF processing techniques to ensure redacted information is completely removed from the document structure.')
    },
    {
      question: t('faq.fileSize.question', 'What file size limits do you have?'),
      answer: t('faq.fileSize.answer', 'Our tool supports PDF files up to 50MB in size. This covers most standard business documents, legal papers, and reports. Processing is done locally in your browser, so larger files may take longer to process depending on your device capabilities.')
    },
    {
      question: t('faq.browserSupport.question', 'Which browsers are supported?'),
      answer: t('faq.browserSupport.answer', 'Our PDF redaction tool works in all modern web browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version of your browser for optimal performance. JavaScript must be enabled for the tool to function.')
    },
    {
      question: t('faq.redactionMethods.question', 'What redaction methods do you offer?'),
      answer: t('faq.redactionMethods.answer', 'We offer two primary redaction methods: 1) Black-out redaction - completely covers sensitive areas with solid black rectangles, 2) Pixelation - obscures text and images with pixelated overlays. Both methods ensure the original content cannot be recovered.')
    },
    {
      question: t('faq.compliance.question', 'Is this tool suitable for legal and compliance requirements?'),
      answer: t('faq.compliance.answer', 'Yes, our tool is designed to meet strict compliance requirements including GDPR, HIPAA, and legal discovery standards. The redaction process permanently removes sensitive data from the PDF structure, making it forensically sound for legal and regulatory purposes.')
    },
    {
      question: t('faq.multiLanguage.question', 'Do you support multiple languages?'),
      answer: t('faq.multiLanguage.answer', 'Yes, our interface supports multiple languages including English, Chinese, and others. The redaction functionality works with PDF documents in any language, as it operates on the visual content rather than text recognition.')
    },
    {
      question: t('faq.cost.question', 'Is this tool completely free?'),
      answer: t('faq.cost.answer', 'Yes, our PDF redaction tool is completely free to use with no hidden charges, subscriptions, or usage limits. We believe document privacy should be accessible to everyone. The tool is open-source and community-driven.')
    }
  ];

  return (
    <section className="py-12 bg-white" id="faq">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('faq.title', 'Frequently Asked Questions')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('faq.subtitle', 'Everything you need to know about secure PDF redaction and document privacy protection.')}
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
            {t('faq.cta.title', 'Ready to Secure Your Documents?')}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('faq.cta.description', 'Start redacting sensitive information from your PDF files now with our free, secure tool.')}
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
          >
            {t('faq.cta.button', 'Start Redacting Now')}
          </button>
        </div>
      </div>
    </section>
  );
};
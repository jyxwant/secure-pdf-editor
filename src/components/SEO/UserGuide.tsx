import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Upload, Edit3, Download, Lock, Globe, Zap, CheckCircle } from 'lucide-react';

export const UserGuide: React.FC = () => {
  const { t } = useTranslation();

  const steps = [
    {
      icon: Upload,
      title: t('guide.step1.title', 'Upload Your PDF'),
      description: t('guide.step1.description', 'Select and upload your PDF document. Files are processed locally in your browser for maximum security - no uploads to external servers.'),
      details: [
        t('guide.step1.detail1', 'Support for PDF files up to 50MB'),
        t('guide.step1.detail2', 'Compatible with all PDF versions'),
        t('guide.step1.detail3', 'No account or registration required')
      ]
    },
    {
      icon: Edit3,
      title: t('guide.step2.title', 'Mark Sensitive Areas'),
      description: t('guide.step2.description', 'Click and drag to select areas containing sensitive information. You can mark multiple areas across different pages.'),
      details: [
        t('guide.step2.detail1', 'Precise rectangular selection tool'),
        t('guide.step2.detail2', 'Multiple redaction areas per page'),
        t('guide.step2.detail3', 'Undo/redo functionality available')
      ]
    },
    {
      icon: Lock,
      title: t('guide.step3.title', 'Choose Redaction Method'),
      description: t('guide.step3.description', 'Select between black-out redaction or pixelation based on your security needs and document requirements.'),
      details: [
        t('guide.step3.detail1', 'Black-out: Complete coverage with solid color'),
        t('guide.step3.detail2', 'Pixelation: Obscure with pixelated overlay'),
        t('guide.step3.detail3', 'Both methods ensure data is unrecoverable')
      ]
    },
    {
      icon: Download,
      title: t('guide.step4.title', 'Download Secure PDF'),
      description: t('guide.step4.description', 'Process and download your redacted PDF. The sensitive information is permanently removed from the document structure.'),
      details: [
        t('guide.step4.detail1', 'Instant processing and download'),
        t('guide.step4.detail2', 'Original document structure preserved'),
        t('guide.step4.detail3', 'Forensically sound redaction')
      ]
    }
  ];

  const features = [
    {
      icon: Shield,
      title: t('features.security.title', 'Maximum Security'),
      description: t('features.security.description', 'All processing happens locally in your browser. Your sensitive documents never leave your computer.')
    },
    {
      icon: Globe,
      title: t('features.multilingual.title', 'Multi-Language Support'),
      description: t('features.multilingual.description', 'Available in multiple languages with support for documents in any language.')
    },
    {
      icon: Zap,
      title: t('features.performance.title', 'Fast Processing'),
      description: t('features.performance.description', 'Optimized performance with worker threads for smooth, responsive redaction even on large documents.')
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100" id="guide">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            {t('guide.title', 'How to Use Our PDF Redaction Tool')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('guide.subtitle', 'Follow these simple steps to securely remove sensitive information from your PDF documents. Our tool ensures complete data removal while maintaining document integrity.')}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-blue-100">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-600 text-white rounded-full p-3 mr-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                    {t('guide.step', 'Step')} {index + 1}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {step.description}
                </p>
                
                <ul className="space-y-2">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Key Features */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            {t('guide.keyFeatures', 'Key Features & Benefits')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Compliance & Security Info */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
          <div className="text-center">
            <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('guide.compliance.title', 'Compliance & Security Standards')}
            </h3>
            <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto leading-relaxed">
              {t('guide.compliance.description', 'Our PDF redaction tool meets strict security and compliance requirements for legal, healthcare, and business use cases.')}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {['GDPR', 'HIPAA', 'SOX', 'PCI DSS'].map((standard) => (
                <div key={standard} className="bg-white rounded-lg px-4 py-3 shadow-sm border border-green-200">
                  <div className="text-green-800 font-semibold text-center">{standard}</div>
                  <div className="text-xs text-green-600 text-center mt-1">
                    {t('guide.compliance.compliant', 'Compliant')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
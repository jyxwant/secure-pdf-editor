import React from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Edit3, Download, Lock } from 'lucide-react';

export const UserGuide: React.FC = () => {
  const { t } = useTranslation();

  const steps = [
    {
      icon: Upload,
      title: t('guide.step1.title'),
      description: t('guide.step1.description')
    },
    {
      icon: Edit3,
      title: t('guide.step2.title'),
      description: t('guide.step2.description')
    },
    {
      icon: Lock,
      title: t('guide.step3.title'),
      description: t('guide.step3.description')
    },
    {
      icon: Download,
      title: t('guide.step4.title'),
      description: t('guide.step4.description')
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50/50 to-white">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header - ChatGPT/Apple style */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 tracking-tight">
            {t('guide.title')}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto font-light">
            {t('guide.subtitle')}
          </p>
        </div>

        {/* Steps - Clean Apple-like design */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-100/50 hover:border-gray-200/50 hover:shadow-md transition-all duration-300 ease-out">
                <div className="flex items-start space-x-5">
                  {/* Step number - Apple style with softer gray */}
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-medium shadow-sm">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-4">
                      <Icon className="w-5 h-5 text-gray-500" />
                      <h3 className="text-lg font-medium text-gray-900 tracking-tight">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed font-light">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Info - Minimal Apple style */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-3 text-gray-700 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-100/50 shadow-sm">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-sm"></div>
            <span className="font-light text-sm tracking-wide">{t('guide.compliance.description')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
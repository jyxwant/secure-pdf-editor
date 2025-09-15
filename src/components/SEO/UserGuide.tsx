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
    <section className="py-16 bg-gray-50/30">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header - 简洁标题 */}
        <div className="text-center mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            {t('guide.title')}
          </h2>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            {t('guide.subtitle')}
          </p>
        </div>

        {/* Steps - 简洁卡片布局 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-100 hover:border-gray-200 transition-colors duration-200">
                <div className="flex items-start space-x-4">
                  {/* Step number */}
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-3">
                      <Icon className="w-5 h-5 text-gray-400" />
                      <h3 className="text-base font-medium text-gray-900">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Info - 极简设计 */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-600 bg-white rounded-full px-4 py-2 border border-gray-100">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{t('guide.compliance.description')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
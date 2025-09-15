import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Zap, Globe, Lock } from 'lucide-react';

export const Features: React.FC = () => {
  const { t } = useTranslation();

  const mainFeatures = [
    {
      icon: Shield,
      title: t('features.localProcessing.title'),
      description: t('features.localProcessing.description')
    },
    {
      icon: Lock,
      title: t('features.permanentRedaction.title'),
      description: t('features.permanentRedaction.description')
    },
    {
      icon: Zap,
      title: t('features.fastProcessing.title'),
      description: t('features.fastProcessing.description')
    },
    {
      icon: Globe,
      title: t('features.multiLanguage.title'),
      description: t('features.multiLanguage.description')
    }
  ];

  const useCases = [
    {
      title: t('useCases.legal.title'),
      description: t('useCases.legal.description')
    },
    {
      title: t('useCases.healthcare.title'),
      description: t('useCases.healthcare.description')
    },
    {
      title: t('useCases.business.title'),
      description: t('useCases.business.description')
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header - 简洁标题 */}
        <div className="text-center mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            {t('features.title')}
          </h2>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        {/* Main Features - 简洁网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-left">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Use Cases - 简洁列表 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-8 text-center">
            {t('useCases.title')}
          </h3>
          <div className="space-y-6">
            {useCases.map((useCase, index) => (
              <div key={index} className="border-l-2 border-gray-100 pl-6">
                <h4 className="text-base font-medium text-gray-900 mb-2">
                  {useCase.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
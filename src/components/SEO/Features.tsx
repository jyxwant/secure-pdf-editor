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
    <section className="py-20 bg-gradient-to-b from-white to-gray-50/30">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header - Apple/ChatGPT style */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 tracking-tight">
            {t('features.title')}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto font-light">
            {t('features.subtitle')}
          </p>
        </div>

        {/* Main Features - Clean Apple style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-100/50 hover:border-gray-200/50 hover:shadow-md transition-all duration-300 ease-out">
                <div className="flex items-start space-x-5">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100/50 shadow-sm">
                    <Icon className="w-6 h-6 text-gray-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed font-light">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Use Cases - Refined layout */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-100/50">
          <h3 className="text-xl font-medium text-gray-900 mb-8 text-center tracking-tight">
            {t('useCases.title')}
          </h3>
          <div className="space-y-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-1 h-16 bg-gradient-to-b from-gray-200 to-gray-300 rounded-full"></div>
                <div className="flex-1 min-w-0 pt-1">
                  <h4 className="text-base font-medium text-gray-900 mb-2 tracking-tight">
                    {useCase.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed font-light text-sm">
                    {useCase.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
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
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-black mb-4 uppercase tracking-tight">
            {t('features.title')}
          </h2>
          <div className="w-24 h-2 bg-yellow-400 mx-auto border-2 border-black mb-6"></div>
          <p className="text-xl text-gray-700 font-bold max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="neo-card flex items-start space-x-4 bg-white hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-300 border-2 border-black flex items-center justify-center">
                  <Icon className="w-6 h-6 text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-black text-black mb-2 uppercase">
                    {feature.title}
                  </h3>
                  <p className="text-base text-gray-800 font-medium leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Use Cases */}
        <div className="neo-box p-8 bg-blue-50">
          <h3 className="text-2xl font-black text-black mb-8 text-center uppercase">
            {t('useCases.title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="border-l-4 border-black pl-6 py-2">
                <h4 className="text-lg font-black text-black mb-2">
                  {useCase.title}
                </h4>
                <p className="text-sm text-gray-800 font-bold leading-relaxed">
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

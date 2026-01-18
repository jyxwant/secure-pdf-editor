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
    <section className="py-16 bg-[#f0f0f0]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-black mb-4 uppercase tracking-tight">
            {t('guide.title')}
          </h2>
          <div className="w-24 h-2 bg-pink-400 mx-auto border-2 border-black mb-6"></div>
          <p className="text-xl text-gray-700 font-bold max-w-2xl mx-auto">
            {t('guide.subtitle')}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="neo-box p-6 flex flex-col h-full relative group hover:-translate-y-2 transition-transform duration-200">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-black text-white border-2 border-white flex items-center justify-center text-xl font-black shadow-md z-10">
                  {index + 1}
                </div>
                
                <div className="flex-1 flex flex-col items-center text-center pt-4">
                  <div className="w-16 h-16 bg-white border-2 border-black rounded-full flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Icon className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-lg font-black text-black mb-3 uppercase">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-800 font-medium leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Info */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-3 text-base font-bold text-black bg-white px-6 py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-3 h-3 bg-green-500 border border-black rounded-full animate-pulse"></div>
            <span>{t('guide.compliance.description')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

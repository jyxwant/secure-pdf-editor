import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Server, Lock, AlertTriangle, CheckCircle, Eye, Clock, Globe, Zap, Database } from 'lucide-react';

export const LocalProcessingArticle: React.FC = () => {
  const { t } = useTranslation();

  const comparisonPoints = [
    {
      aspect: t('localProcessing.comparison.dataTransfer.aspect'),
      local: t('localProcessing.comparison.dataTransfer.local'),
      cloud: t('localProcessing.comparison.dataTransfer.cloud'),
      localAdvantage: true
    },
    {
      aspect: t('localProcessing.comparison.privacy.aspect'),
      local: t('localProcessing.comparison.privacy.local'),
      cloud: t('localProcessing.comparison.privacy.cloud'),
      localAdvantage: true
    },
    {
      aspect: t('localProcessing.comparison.speed.aspect'),
      local: t('localProcessing.comparison.speed.local'),
      cloud: t('localProcessing.comparison.speed.cloud'),
      localAdvantage: true
    },
    {
      aspect: t('localProcessing.comparison.reliability.aspect'),
      local: t('localProcessing.comparison.reliability.local'),
      cloud: t('localProcessing.comparison.reliability.cloud'),
      localAdvantage: true
    },
    {
      aspect: t('localProcessing.comparison.cost.aspect'),
      local: t('localProcessing.comparison.cost.local'),
      cloud: t('localProcessing.comparison.cost.cloud'),
      localAdvantage: true
    }
  ];

  const securityRisks = [
    {
      icon: Database,
      title: t('localProcessing.risks.dataBreaches.title'),
      description: t('localProcessing.risks.dataBreaches.description'),
      impact: t('localProcessing.risks.dataBreaches.impact')
    },
    {
      icon: Eye,
      title: t('localProcessing.risks.surveillance.title'),
      description: t('localProcessing.risks.surveillance.description'),
      impact: t('localProcessing.risks.surveillance.impact')
    },
    {
      icon: Globe,
      title: t('localProcessing.risks.jurisdiction.title'),
      description: t('localProcessing.risks.jurisdiction.description'),
      impact: t('localProcessing.risks.jurisdiction.impact')
    },
    {
      icon: Server,
      title: t('localProcessing.risks.vendorLock.title'),
      description: t('localProcessing.risks.vendorLock.description'),
      impact: t('localProcessing.risks.vendorLock.impact')
    }
  ];

  const localBenefits = [
    {
      icon: Lock,
      title: t('localProcessing.benefits.zeroUpload.title'),
      description: t('localProcessing.benefits.zeroUpload.description')
    },
    {
      icon: Zap,
      title: t('localProcessing.benefits.instantProcessing.title'),
      description: t('localProcessing.benefits.instantProcessing.description')
    },
    {
      icon: Shield,
      title: t('localProcessing.benefits.fullControl.title'),
      description: t('localProcessing.benefits.fullControl.description')
    },
    {
      icon: Clock,
      title: t('localProcessing.benefits.noLatency.title'),
      description: t('localProcessing.benefits.noLatency.description')
    }
  ];

  const realWorldCases = [
    {
      sector: t('localProcessing.cases.legal.sector'),
      scenario: t('localProcessing.cases.legal.scenario'),
      risk: t('localProcessing.cases.legal.risk'),
      solution: t('localProcessing.cases.legal.solution')
    },
    {
      sector: t('localProcessing.cases.healthcare.sector'),
      scenario: t('localProcessing.cases.healthcare.scenario'),
      risk: t('localProcessing.cases.healthcare.risk'),
      solution: t('localProcessing.cases.healthcare.solution')
    },
    {
      sector: t('localProcessing.cases.finance.sector'),
      scenario: t('localProcessing.cases.finance.scenario'),
      risk: t('localProcessing.cases.finance.risk'),
      solution: t('localProcessing.cases.finance.solution')
    },
    {
      sector: t('localProcessing.cases.government.sector'),
      scenario: t('localProcessing.cases.government.scenario'),
      risk: t('localProcessing.cases.government.risk'),
      solution: t('localProcessing.cases.government.solution')
    }
  ];

  return (
    <article className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        {/* Article Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-10 h-10 text-blue-600 mr-3" />
            <Server className="w-10 h-10 text-gray-400 mr-3 relative">
              <div className="absolute inset-0 bg-red-500 opacity-20 rounded"></div>
              <div className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✕</span>
              </div>
            </Server>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {t('localProcessing.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('localProcessing.subtitle')}
          </p>
          <div className="mt-8 text-sm text-gray-500">
            {t('localProcessing.lastUpdated')}: {new Date().toLocaleDateString()}
          </div>
        </header>

        {/* Introduction */}
        <section className="mb-16">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg mb-8">
            <div className="flex">
              <AlertTriangle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-800 font-medium mb-2">
                  {t('localProcessing.intro.warning')}
                </p>
                <p className="text-blue-700 text-sm">
                  {t('localProcessing.intro.context')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cloud Security Risks */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
            <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
            {t('localProcessing.risksSection.title')}
          </h2>
          <div className="space-y-6">
            {securityRisks.map((risk, index) => {
              const Icon = risk.icon;
              return (
                <div key={index} className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-red-900 mb-3">{risk.title}</h3>
                      <p className="text-red-800 mb-4 leading-relaxed">{risk.description}</p>
                      <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                        <p className="text-red-900 font-medium text-sm">
                          <strong>{t('localProcessing.potentialImpact')}:</strong> {risk.impact}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Local Processing Benefits */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
            <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
            {t('localProcessing.benefitsSection.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {localBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-900 mb-2">{benefit.title}</h3>
                      <p className="text-green-800 text-sm leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Comparison Table */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            {t('localProcessing.comparisonSection.title')}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-200 rounded-xl shadow-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left font-semibold text-gray-900 border-b">
                    {t('localProcessing.comparisonSection.aspect')}
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-green-700 border-b">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      {t('localProcessing.comparisonSection.local')}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-red-700 border-b">
                    <div className="flex items-center">
                      <Server className="w-5 h-5 mr-2" />
                      {t('localProcessing.comparisonSection.cloud')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonPoints.map((point, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="px-6 py-4 font-medium text-gray-900">{point.aspect}</td>
                    <td className="px-6 py-4 text-green-700 bg-green-50">
                      <div className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{point.local}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-red-700 bg-red-50">
                      <div className="flex items-start">
                        <AlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{point.cloud}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Real-World Cases */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            {t('localProcessing.casesSection.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {realWorldCases.map((case_, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">{case_.sector}</h3>
                  <p className="text-gray-700 text-sm mb-3">{case_.scenario}</p>
                </div>
                <div className="space-y-3">
                  <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-r">
                    <p className="text-red-800 text-sm">
                      <strong>{t('localProcessing.risk')}:</strong> {case_.risk}
                    </p>
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded-r">
                    <p className="text-green-800 text-sm">
                      <strong>{t('localProcessing.solution')}:</strong> {case_.solution}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Conclusion CTA */}
        <section className="text-center bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl p-8">
          <Lock className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h3 className="text-2xl font-bold mb-4">{t('localProcessing.conclusion.title')}</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            {t('localProcessing.conclusion.description')}
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
          >
            {t('localProcessing.conclusion.button')}
          </button>
        </section>
      </div>
    </article>
  );
};
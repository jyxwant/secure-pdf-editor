import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Lock, Eye, Server, AlertTriangle, CheckCircle, Globe, FileText, Zap } from 'lucide-react';

export const SecurityGuide: React.FC = () => {
  const { t } = useTranslation();

  const securityThreat = [
    {
      icon: Server,
      title: t('securityGuide.threats.cloudRisks.title'),
      description: t('securityGuide.threats.cloudRisks.description'),
      severity: 'high'
    },
    {
      icon: Eye,
      title: t('securityGuide.threats.dataBreaches.title'),
      description: t('securityGuide.threats.dataBreaches.description'),
      severity: 'high'
    },
    {
      icon: FileText,
      title: t('securityGuide.threats.metadataLeaks.title'),
      description: t('securityGuide.threats.metadataLeaks.description'),
      severity: 'medium'
    },
    {
      icon: Globe,
      title: t('securityGuide.threats.jurisdictionRisks.title'),
      description: t('securityGuide.threats.jurisdictionRisks.description'),
      severity: 'medium'
    }
  ];

  const securityBestPractices = [
    {
      icon: Lock,
      title: t('securityGuide.practices.localProcessing.title'),
      description: t('securityGuide.practices.localProcessing.description'),
      benefit: t('securityGuide.practices.localProcessing.benefit')
    },
    {
      icon: Shield,
      title: t('securityGuide.practices.permanentRedaction.title'),
      description: t('securityGuide.practices.permanentRedaction.description'),
      benefit: t('securityGuide.practices.permanentRedaction.benefit')
    },
    {
      icon: Zap,
      title: t('securityGuide.practices.realtimePreview.title'),
      description: t('securityGuide.practices.realtimePreview.description'),
      benefit: t('securityGuide.practices.realtimePreview.benefit')
    },
    {
      icon: FileText,
      title: t('securityGuide.practices.metadataCleaning.title'),
      description: t('securityGuide.practices.metadataCleaning.description'),
      benefit: t('securityGuide.practices.metadataCleaning.benefit')
    }
  ];

  const complianceFrameworks = [
    {
      name: 'GDPR',
      fullName: t('securityGuide.compliance.gdpr.fullName'),
      description: t('securityGuide.compliance.gdpr.description'),
      requirements: t('securityGuide.compliance.gdpr.requirements')
    },
    {
      name: 'HIPAA',
      fullName: t('securityGuide.compliance.hipaa.fullName'),
      description: t('securityGuide.compliance.hipaa.description'),
      requirements: t('securityGuide.compliance.hipaa.requirements')
    },
    {
      name: 'SOX',
      fullName: t('securityGuide.compliance.sox.fullName'),
      description: t('securityGuide.compliance.sox.description'),
      requirements: t('securityGuide.compliance.sox.requirements')
    },
    {
      name: 'PCI DSS',
      fullName: t('securityGuide.compliance.pci.fullName'),
      description: t('securityGuide.compliance.pci.description'),
      requirements: t('securityGuide.compliance.pci.requirements')
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              {t('securityGuide.title')}
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('securityGuide.subtitle')}
          </p>
        </div>

        {/* Security Threats Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
            <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
            {t('securityGuide.threatsSection.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityThreat.map((threat, index) => {
              const Icon = threat.icon;
              return (
                <div key={index} className={`p-6 rounded-lg border-2 ${getSeverityColor(threat.severity)}`}>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-lg">{threat.title}</h3>
                      <p className="text-sm opacity-90 leading-relaxed">{threat.description}</p>
                      <div className="mt-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          threat.severity === 'high' ? 'bg-red-100 text-red-700' :
                          threat.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {t(`securityGuide.severity.${threat.severity}`)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best Practices Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
            <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
            {t('securityGuide.practicesSection.title')}
          </h2>
          <div className="space-y-6">
            {securityBestPractices.map((practice, index) => {
              const Icon = practice.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{practice.title}</h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">{practice.description}</p>
                      <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                        <p className="text-green-700 font-medium text-sm">
                          <strong>{t('securityGuide.benefit')}:</strong> {practice.benefit}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Compliance Frameworks Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
            <FileText className="w-6 h-6 text-blue-500 mr-3" />
            {t('securityGuide.complianceSection.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complianceFrameworks.map((framework, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="mb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-lg font-bold text-blue-600">{framework.name}</span>
                    <span className="text-sm text-gray-500">({framework.fullName})</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{framework.description}</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>{t('securityGuide.requirements')}:</strong> {framework.requirements}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-blue-600 text-white rounded-xl p-8">
          <Shield className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h3 className="text-2xl font-bold mb-4">{t('securityGuide.cta.title')}</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            {t('securityGuide.cta.description')}
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
          >
            {t('securityGuide.cta.button')}
          </button>
        </div>
      </div>
    </section>
  );
};
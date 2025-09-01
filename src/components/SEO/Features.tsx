import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Shield, 
  Zap, 
  Globe, 
  Lock, 
  Eye, 
  FileText, 
  Users, 
  Award,
  CheckCircle,
  Star
} from 'lucide-react';

export const Features: React.FC = () => {
  const { t } = useTranslation();

  const mainFeatures = [
    {
      icon: Shield,
      title: t('features.localProcessing.title', '100% Local Processing'),
      description: t('features.localProcessing.description', 'Your PDF files never leave your computer. All redaction processing happens locally in your browser, ensuring maximum privacy and security for sensitive documents.'),
      highlight: t('features.localProcessing.highlight', 'Zero Server Uploads')
    },
    {
      icon: Lock,
      title: t('features.permanentRedaction.title', 'Permanent Redaction'),
      description: t('features.permanentRedaction.description', 'Unlike simple covering or hiding, our tool completely removes sensitive data from the PDF structure, making it forensically impossible to recover the original information.'),
      highlight: t('features.permanentRedaction.highlight', 'Forensically Sound')
    },
    {
      icon: Zap,
      title: t('features.fastProcessing.title', 'Lightning Fast Performance'),
      description: t('features.fastProcessing.description', 'Optimized with Web Workers and advanced PDF processing techniques to handle large documents quickly without freezing your browser.'),
      highlight: t('features.fastProcessing.highlight', 'Web Worker Optimized')
    },
    {
      icon: Globe,
      title: t('features.multiLanguage.title', 'Multi-Language Support'),
      description: t('features.multiLanguage.description', 'Interface available in multiple languages, and works with PDF documents containing text in any language or script.'),
      highlight: t('features.multiLanguage.highlight', 'Universal Compatibility')
    }
  ];

  const additionalFeatures = [
    {
      icon: Eye,
      title: t('features.preview.title', 'Live Preview'),
      description: t('features.preview.description', 'Preview your redactions before processing to ensure all sensitive information is properly covered.')
    },
    {
      icon: FileText,
      title: t('features.multipleFormats.title', 'Multiple Redaction Methods'),
      description: t('features.multipleFormats.description', 'Choose between black-out redaction, pixelation, or other methods based on your specific needs.')
    },
    {
      icon: Users,
      title: t('features.collaborative.title', 'Team-Friendly'),
      description: t('features.collaborative.description', 'Perfect for legal teams, healthcare organizations, and businesses handling sensitive documents.')
    },
    {
      icon: Award,
      title: t('features.compliance.title', 'Compliance Ready'),
      description: t('features.compliance.description', 'Meets GDPR, HIPAA, SOX, and other regulatory requirements for document redaction and privacy protection.')
    }
  ];

  const stats = [
    { number: '50MB', label: t('stats.fileSize', 'Max File Size') },
    { number: '0$', label: t('stats.cost', 'Always Free') },
    { number: '100%', label: t('stats.privacy', 'Privacy Protected') },
    { number: '24/7', label: t('stats.availability', 'Available Anytime') }
  ];

  return (
    <section className="py-16 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            {t('features.title', 'Professional PDF Redaction Made Simple')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('features.subtitle', 'Secure your sensitive documents with enterprise-grade redaction technology that works entirely in your browser. No uploads, no registration, no compromises on privacy.')}
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start mb-6">
                  <div className="bg-blue-600 text-white rounded-lg p-3 mr-4">
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                      {feature.highlight}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">
                      {feature.title}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">
              {t('stats.title', 'Trusted by Professionals Worldwide')}
            </h3>
            <p className="text-blue-200">
              {t('stats.subtitle', 'Join thousands of users who trust our secure redaction technology')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-200 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {additionalFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Use Cases */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            {t('useCases.title', 'Perfect for Professional Use Cases')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 text-green-600 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                {t('useCases.legal.title', 'Legal & Law Firms')}
              </h4>
              <p className="text-gray-600 mb-4">
                {t('useCases.legal.description', 'Redact privileged information, client details, and sensitive data from court documents, contracts, and legal briefs.')}
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  {t('useCases.legal.benefit1', 'Attorney-Client Privilege')}
                </li>
                <li className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  {t('useCases.legal.benefit2', 'Discovery Compliance')}
                </li>
              </ul>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                {t('useCases.healthcare.title', 'Healthcare & Medical')}
              </h4>
              <p className="text-gray-600 mb-4">
                {t('useCases.healthcare.description', 'Protect patient information in medical records, research documents, and insurance claims while maintaining HIPAA compliance.')}
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  {t('useCases.healthcare.benefit1', 'HIPAA Compliant')}
                </li>
                <li className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  {t('useCases.healthcare.benefit2', 'Patient Privacy')}
                </li>
              </ul>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 text-purple-600 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                {t('useCases.business.title', 'Business & Enterprise')}
              </h4>
              <p className="text-gray-600 mb-4">
                {t('useCases.business.description', 'Remove confidential information from financial reports, employee records, and business documents for public disclosure.')}
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  {t('useCases.business.benefit1', 'GDPR Compliance')}
                </li>
                <li className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  {t('useCases.business.benefit2', 'Corporate Security')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
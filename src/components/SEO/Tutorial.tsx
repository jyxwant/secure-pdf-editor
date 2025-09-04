import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, FileUp, MousePointer, Eye, Download, ChevronRight, ChevronDown, Monitor, Smartphone, Keyboard, Zap } from 'lucide-react';

export const Tutorial: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [openSections, setOpenSections] = useState<number[]>([0]); // First section open by default
  const [selectedMethod, setSelectedMethod] = useState<'canvas' | 'pixelate'>('canvas');

  const toggleSection = (index: number) => {
    setOpenSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const basicSteps = [
    {
      icon: FileUp,
      title: t('tutorial.steps.upload.title'),
      description: t('tutorial.steps.upload.description'),
      details: t('tutorial.steps.upload.details'),
      tips: t('tutorial.steps.upload.tips')
    },
    {
      icon: MousePointer,
      title: t('tutorial.steps.select.title'),
      description: t('tutorial.steps.select.description'),
      details: t('tutorial.steps.select.details'),
      tips: t('tutorial.steps.select.tips')
    },
    {
      icon: Eye,
      title: t('tutorial.steps.preview.title'),
      description: t('tutorial.steps.preview.description'),
      details: t('tutorial.steps.preview.details'),
      tips: t('tutorial.steps.preview.tips')
    },
    {
      icon: Zap,
      title: t('tutorial.steps.process.title'),
      description: t('tutorial.steps.process.description'),
      details: t('tutorial.steps.process.details'),
      tips: t('tutorial.steps.process.tips')
    },
    {
      icon: Download,
      title: t('tutorial.steps.download.title'),
      description: t('tutorial.steps.download.description'),
      details: t('tutorial.steps.download.details'),
      tips: t('tutorial.steps.download.tips')
    }
  ];

  const keyboardShortcuts = [
    { keys: '← / →', action: t('tutorial.shortcuts.navigate') },
    { keys: '+ / -', action: t('tutorial.shortcuts.zoom') },
    { keys: '0', action: t('tutorial.shortcuts.reset') },
    { keys: 'F', action: t('tutorial.shortcuts.fit') },
    { keys: 'Space', action: t('tutorial.shortcuts.pan') },
    { keys: 'Delete', action: t('tutorial.shortcuts.delete') },
    { keys: 'Ctrl+Z', action: t('tutorial.shortcuts.undo') },
    { keys: 'Ctrl+Y', action: t('tutorial.shortcuts.redo') },
    { keys: 'Esc', action: t('tutorial.shortcuts.cancel') }
  ];

  const redactionMethods = [
    {
      method: 'canvas',
      name: t('tutorial.methods.canvas.name'),
      description: t('tutorial.methods.canvas.description'),
      security: 5,
      speed: 3,
      fileSize: 'large',
      bestFor: t('tutorial.methods.canvas.bestFor'),
      pros: t('tutorial.methods.canvas.pros'),
      cons: t('tutorial.methods.canvas.cons')
    },
    {
      method: 'pixelate',
      name: t('tutorial.methods.pixelate.name'),
      description: t('tutorial.methods.pixelate.description'),
      security: 4,
      speed: 5,
      fileSize: 'small',
      bestFor: t('tutorial.methods.pixelate.bestFor'),
      pros: t('tutorial.methods.pixelate.pros'),
      cons: t('tutorial.methods.pixelate.cons')
    }
  ];

  const advancedTips = [
    {
      title: t('tutorial.advanced.batchSelection.title'),
      description: t('tutorial.advanced.batchSelection.description'),
      icon: MousePointer
    },
    {
      title: t('tutorial.advanced.precisionZoom.title'),
      description: t('tutorial.advanced.precisionZoom.description'),
      icon: Eye
    },
    {
      title: t('tutorial.advanced.multiPage.title'),
      description: t('tutorial.advanced.multiPage.description'),
      icon: FileUp
    },
    {
      title: t('tutorial.advanced.undoRedo.title'),
      description: t('tutorial.advanced.undoRedo.description'),
      icon: Keyboard
    }
  ];

  const troubleshooting = [
    {
      problem: t('tutorial.troubleshooting.slowPerformance.problem'),
      solutions: t('tutorial.troubleshooting.slowPerformance.solutions').split('|')
    },
    {
      problem: t('tutorial.troubleshooting.uploadFailed.problem'),
      solutions: t('tutorial.troubleshooting.uploadFailed.solutions').split('|')
    },
    {
      problem: t('tutorial.troubleshooting.redactionNotWorking.problem'),
      solutions: t('tutorial.troubleshooting.redactionNotWorking.solutions').split('|')
    },
    {
      problem: t('tutorial.troubleshooting.browserCompatibility.problem'),
      solutions: t('tutorial.troubleshooting.browserCompatibility.solutions').split('|')
    }
  ];

  const SecurityRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          key={star}
          className={`w-4 h-4 rounded-full ${
            star <= rating ? 'bg-green-500' : 'bg-gray-200'
          }`}
        />
      ))}
      <span className="text-sm text-gray-600 ml-2">({rating}/5)</span>
    </div>
  );

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Play className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              {t('tutorial.title')}
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('tutorial.subtitle')}
          </p>
        </div>

        {/* Quick Start Video Placeholder */}
        <div className="mb-16">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{t('tutorial.quickStart.title')}</h3>
                  <p className="text-blue-100">{t('tutorial.quickStart.description')}</p>
                </div>
                <Play className="w-12 h-12 text-white opacity-80" />
              </div>
            </div>
            <div className="aspect-video bg-gray-100 flex items-center justify-center border-t">
              <div className="text-center">
                <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{t('tutorial.videoPlaceholder')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Steps */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            {t('tutorial.basicSteps.title')}
          </h2>
          <div className="space-y-4">
            {basicSteps.map((step, index) => {
              const Icon = step.icon;
              const isOpen = openSections.includes(index);
              
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleSection(index)}
                    className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-3">
                            <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full font-medium">
                              {t('tutorial.step')} {index + 1}
                            </span>
                            <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                          </div>
                          <p className="text-gray-600 mt-1">{step.description}</p>
                        </div>
                      </div>
                      {isOpen ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>
                  
                  {isOpen && (
                    <div className="px-6 pb-6 border-t border-gray-100 bg-gray-50">
                      <div className="pt-4">
                        <div className="prose prose-sm max-w-none">
                          <p className="text-gray-700 mb-4">{step.details}</p>
                          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                            <p className="text-blue-800 font-medium text-sm">
                              <strong>{t('tutorial.tip')}:</strong> {step.tips}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Redaction Methods Comparison */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            {t('tutorial.redactionMethods.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {redactionMethods.map((method) => (
              <div key={method.method} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{method.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{method.description}</p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{t('tutorial.security')}</span>
                      <SecurityRating rating={method.security} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{t('tutorial.speed')}</span>
                      <SecurityRating rating={method.speed} />
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700">{t('tutorial.fileSize')}: </span>
                    <span className={`text-sm ${method.fileSize === 'large' ? 'text-orange-600' : 'text-green-600'}`}>
                      {t(`tutorial.${method.fileSize}`)}
                    </span>
                  </div>
                </div>
                
                <div className="border-t pt-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">{t('tutorial.bestFor')}:</p>
                    <p className="text-sm text-gray-600">{method.bestFor}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-700 mb-1">{t('tutorial.pros')}:</p>
                    <p className="text-sm text-green-600">{method.pros}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-700 mb-1">{t('tutorial.cons')}:</p>
                    <p className="text-sm text-orange-600">{method.cons}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
            <Keyboard className="w-6 h-6 text-blue-600 mr-3" />
            {t('tutorial.keyboardShortcuts.title')}
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {keyboardShortcuts.map((shortcut, index) => (
                <div key={index} className={`p-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} ${index < keyboardShortcuts.length - 1 ? 'border-b md:border-b-0' : ''} ${index % 2 === 0 ? 'md:border-r' : ''} border-gray-200`}>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">{shortcut.action}</span>
                    <kbd className="px-3 py-1 bg-gray-200 border border-gray-300 rounded text-sm font-mono text-gray-800">
                      {shortcut.keys}
                    </kbd>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Tips */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            {t('tutorial.advancedTips.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {advancedTips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{tip.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{tip.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device-Specific Tips */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            {t('tutorial.deviceTips.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Monitor className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">{t('tutorial.desktop.title')}</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• {t('tutorial.desktop.tip1')}</li>
                <li>• {t('tutorial.desktop.tip2')}</li>
                <li>• {t('tutorial.desktop.tip3')}</li>
                <li>• {t('tutorial.desktop.tip4')}</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Smartphone className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900">{t('tutorial.mobile.title')}</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• {t('tutorial.mobile.tip1')}</li>
                <li>• {t('tutorial.mobile.tip2')}</li>
                <li>• {t('tutorial.mobile.tip3')}</li>
                <li>• {t('tutorial.mobile.tip4')}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            {t('tutorial.troubleshooting.title')}
          </h2>
          <div className="space-y-4">
            {troubleshooting.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  {item.problem}
                </h3>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-700 mb-2">{t('tutorial.solutions')}:</p>
                  <ul className="space-y-1">
                    {item.solutions.map((solution, sIndex) => (
                      <li key={sIndex} className="text-sm text-gray-600 flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        {solution}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-8">
          <Play className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h3 className="text-2xl font-bold mb-4">{t('tutorial.cta.title')}</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            {t('tutorial.cta.description')}
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
          >
            {t('tutorial.cta.button')}
          </button>
        </div>
      </div>
    </section>
  );
};
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, AlertTriangle, Check, X, Lock, Layers, Zap } from 'lucide-react';

export const SecurityInfo: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Title section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('securityInfo.whyUnsafe')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('securityInfo.description')}
          </p>
        </div>

        {/* 对比说明 */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* 不安全的方法 */}
          <div className="border border-red-200 rounded-lg p-6 bg-red-50">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-red-100 rounded-full mr-3">
                <X className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-red-900">{t('securityInfo.traditional.title')}</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-800">{t('securityInfo.traditional.surface')}</p>
                  <p className="text-sm text-red-700">{t('securityInfo.traditional.surfaceDesc')}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-800">{t('securityInfo.traditional.copyable')}</p>
                  <p className="text-sm text-red-700">{t('securityInfo.traditional.copyableDesc')}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-800">{t('securityInfo.traditional.sourceLeak')}</p>
                  <p className="text-sm text-red-700">{t('securityInfo.traditional.sourceLeakDesc')}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-800">{t('securityInfo.traditional.toolRecover')}</p>
                  <p className="text-sm text-red-700">{t('securityInfo.traditional.toolRecoverDesc')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 安全的方法 */}
          <div className="border border-green-200 rounded-lg p-6 bg-green-50">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-100 rounded-full mr-3">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-900">{t('securityInfo.secure.title')}</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-800">{t('securityInfo.secure.pixelReplace')}</p>
                  <p className="text-sm text-green-700">{t('securityInfo.secure.pixelReplaceDesc')}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-800">{t('securityInfo.secure.pdfRebuild')}</p>
                  <p className="text-sm text-green-700">{t('securityInfo.secure.pdfRebuildDesc')}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-800">{t('securityInfo.secure.canvasRender')}</p>
                  <p className="text-sm text-green-700">{t('securityInfo.secure.canvasRenderDesc')}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-800">{t('securityInfo.secure.clientProcess')}</p>
                  <p className="text-sm text-green-700">{t('securityInfo.secure.clientProcessDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 三种安全方法详解 */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t('securityInfo.methods.title')}
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 rounded-full mr-3">
                  <Layers className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900">{t('securityInfo.methods.canvas.title')}</h4>
                <span className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  {t('toolbar.recommended')}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {t('securityInfo.methods.canvas.desc')}
              </p>
              <p className="text-xs text-blue-600 font-medium">
                {t('securityInfo.methods.canvas.rating')}
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-purple-100 rounded-full mr-3">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900">{t('securityInfo.methods.pixelate.title')}</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {t('securityInfo.methods.pixelate.desc')}
              </p>
              <p className="text-xs text-purple-600 font-medium">
                {t('securityInfo.methods.pixelate.rating')}
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-orange-100 rounded-full mr-3">
                  <Zap className="w-5 h-5 text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-900">{t('securityInfo.methods.rebuild.title')}</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {t('securityInfo.methods.rebuild.desc')}
              </p>
              <p className="text-xs text-orange-600 font-medium">
                {t('securityInfo.methods.rebuild.rating')}
              </p>
            </div>
          </div>
        </div>

        {/* 隐私保护说明 */}
        <div className="bg-blue-900 rounded-lg p-8 text-white mt-8">
          <div className="flex items-center mb-4">
            <Lock className="w-6 h-6 mr-3" />
            <h3 className="text-xl font-semibold">{t('securityInfo.privacy.title')}</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">{t('securityInfo.privacy.local')}</h4>
              <p className="text-blue-100 text-sm">
                {t('securityInfo.privacy.localDesc')}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">{t('securityInfo.privacy.instant')}</h4>
              <p className="text-blue-100 text-sm">
                {t('securityInfo.privacy.instantDesc')}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">{t('securityInfo.privacy.opensource')}</h4>
              <p className="text-blue-100 text-sm">
                {t('securityInfo.privacy.opensourceDesc')}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">{t('securityInfo.privacy.noRegistration')}</h4>
              <p className="text-blue-100 text-sm">
                {t('securityInfo.privacy.noRegistrationDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

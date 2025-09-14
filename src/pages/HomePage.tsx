import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileUploader } from '../components/pdf/FileUploader';
import { FAQ } from '../components/SEO/FAQ';
import { UserGuide } from '../components/SEO/UserGuide';
import { Features } from '../components/SEO/Features';
import { Shield } from 'lucide-react';
import { SEOHead } from '../components/SEO/SEOHead';

interface HomePageProps {
  onFileSelect: (file: File) => void;
  loading: boolean;
  withSEO?: boolean;
}

export function HomePage({ onFileSelect, loading, withSEO = true }: HomePageProps) {
  const { t } = useTranslation();

  return (
    <>
      {withSEO && (
        <SEOHead 
          title={t('app.title')}
          description={t('upload.description')}
          keywords="PDF editor, redaction, security, privacy, document protection"
          canonicalUrl="/"
          lang="en"
          alternates={{ en: 'https://secureredact.tech/', zh: 'https://secureredact.tech/zh', fr: 'https://secureredact.tech/fr' }}
        />
      )}
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mr-4 shadow-sm">
              <Shield className="w-6 h-6 text-gray-600" />
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">{t('upload.title')}</h1>
          </div>
          <p className="text-gray-600 text-lg leading-relaxed font-light mb-8">{t('upload.description')}</p>
        </div>

        {/* 简洁的信息说明区域 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            {t('upload.requirements.title')}
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 文件要求 */}
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-3">{t('upload.fileRequirements.title')}</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{t('upload.fileRequirements.format')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{t('upload.fileRequirements.size')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{t('upload.fileRequirements.password')}</span>
                </div>
              </div>
            </div>

            {/* 使用流程 */}
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-3">{t('upload.usageFlow.title')}</h4>
              <div className="space-y-2">
                <div className="flex items-start text-sm text-gray-700">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-3 mt-0.5 flex-shrink-0 font-medium">1</span>
                  <span>{t('upload.usageFlow.step1')}</span>
                </div>
                <div className="flex items-start text-sm text-gray-700">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-3 mt-0.5 flex-shrink-0 font-medium">2</span>
                  <span>{t('upload.usageFlow.step2')}</span>
                </div>
                <div className="flex items-start text-sm text-gray-700">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-3 mt-0.5 flex-shrink-0 font-medium">3</span>
                  <span>{t('upload.usageFlow.step3')}</span>
                </div>
                <div className="flex items-start text-sm text-gray-700">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-3 mt-0.5 flex-shrink-0 font-medium">4</span>
                  <span>{t('upload.usageFlow.step4')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 安全保障 */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-green-800">{t('security.localProcessing')}</span>
            </div>
            <p className="text-sm text-green-700">{t('security.description')}</p>
          </div>
        </div>

        {/* 上传区域 */}
        <FileUploader 
          onFileSelect={onFileSelect}
          loading={loading}
          error=""
        />
        
        {/* SEO Content Sections */}
        <div className="mt-12">
          <Features />
          <UserGuide />
          <FAQ />
        </div>
      </div>
    </>
  );
}

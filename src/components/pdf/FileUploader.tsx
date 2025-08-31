import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, File, X, FileCheck, AlertTriangle, Info } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  loading?: boolean;
  error?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  loading = false,
  error
}) => {
  const { t } = useTranslation();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string>('');

  // 文件验证函数
  const validateFile = useCallback((file: File): string | null => {
    // 文件类型检查
    if (file.type !== 'application/pdf') {
      return t('fileUploader.validation.formatError');
    }
    
    // 文件大小检查 (50MB限制)
    if (file.size > 50 * 1024 * 1024) {
      return t('fileUploader.validation.sizeError');
    }
    
    // 文件名检查 (避免特殊字符)
    if (!/^[\w\-. ]+$/.test(file.name)) {
      return t('fileUploader.validation.nameError');
    }
    
    return null;
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
      setValidationError('');
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setValidationError('');
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const error = validateFile(file);
      
      if (error) {
        setValidationError(error);
        return;
      }
      
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect, validateFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError('');
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const error = validateFile(file);
      
      if (error) {
        setValidationError(error);
        // 清除input值以允许重新选择相同文件
        e.target.value = '';
        return;
      }
      
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect, validateFile]);

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    setValidationError('');
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
          ${dragActive 
            ? 'border-blue-400 bg-blue-50 scale-[1.02]' 
            : validationError
            ? 'border-red-300 bg-red-50/50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50/50'
          }
          ${loading ? 'pointer-events-none opacity-60' : 'cursor-pointer'}
          ${selectedFile && !validationError ? 'border-green-300 bg-green-50/30' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !loading && document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileInput}
          className="hidden"
          disabled={loading}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          {loading ? (
            <>
              <div className="p-4 bg-blue-100 rounded-full">
                <div className="animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
              <div className="text-blue-600">
                <p className="text-base font-medium">{t('fileUploader.loading.title')}</p>
                <p className="text-sm text-blue-500 mt-1">{t('fileUploader.loading.description')}</p>
              </div>
            </>
          ) : validationError ? (
            <>
              <div className="p-4 bg-red-100 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-red-800">
                  {t('fileUploader.validation.failed')}
                </h3>
                <p className="text-red-600 font-medium">
                  {validationError}
                </p>
                <p className="text-sm text-gray-500">
                  {t('fileUploader.validation.selectValid')}
                </p>
              </div>
            </>
          ) : selectedFile ? (
            <>
              <div className="p-4 bg-green-100 rounded-full">
                <FileCheck className="w-8 h-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-3 text-green-700">
                  <File className="w-5 h-5" />
                  <span className="text-base font-medium max-w-xs truncate">{selectedFile.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile();
                    }}
                    className="p-1 hover:bg-red-100 rounded-full text-red-500 transition-colors"
                    title={t('fileUploader.remove')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-green-600">
                  {formatFileSize(selectedFile.size)} • {t('fileUploader.clickToReselect')}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-gray-800">
                  {t('fileUploader.dragDrop.title')}
                </h3>
                <p className="text-gray-500">
                  {t('fileUploader.dragDrop.subtitle')} <span className="text-blue-600 font-medium hover:text-blue-700">{t('fileUploader.dragDrop.clickToSelect')}</span>
                </p>
                <div className="flex items-center justify-center space-x-4 pt-2">
                  <div className="flex items-center text-xs text-gray-400">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    {t('fileUploader.maxSize')}
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                    </svg>
                    {t('fileUploader.pdfOnly')}
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {t('fileUploader.localProcessing')}
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center text-blue-800">
                    <Info className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-xs">
                      {t('fileUploader.privacy.description')}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

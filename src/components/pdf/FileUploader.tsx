import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, File, X, FileCheck, AlertTriangle, Info } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  loading?: boolean;
  error?: string;
  className?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  loading = false,
  error,
  className
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
    
    return null;
  }, [t]);

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
    <div className={`w-full max-w-2xl mx-auto ${className || ''}`}>
      <div
        className={`
          relative border-4 border-dashed rounded-none p-8 text-center transition-all duration-300
          ${dragActive 
            ? 'border-blue-600 bg-blue-50 scale-[1.02]' 
            : validationError
            ? 'border-red-500 bg-red-50'
            : 'border-black hover:bg-yellow-50 hover:border-black'
          }
          ${loading ? 'pointer-events-none opacity-60' : 'cursor-pointer'}
          ${selectedFile && !validationError ? 'border-green-600 bg-green-50' : ''}
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
              <div className="p-4 bg-blue-100 border-2 border-black rounded-full">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
              <div className="text-black">
                <p className="text-lg font-black">{t('fileUploader.loading.title')}</p>
                <p className="text-sm font-bold text-blue-600 mt-1">{t('fileUploader.loading.description')}</p>
              </div>
            </>
          ) : validationError ? (
            <>
              <div className="p-4 bg-red-100 border-2 border-black rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-red-800">
                  {t('fileUploader.validation.failed')}
                </h3>
                <p className="text-red-600 font-bold">
                  {validationError}
                </p>
                <p className="text-sm font-bold text-gray-500">
                  {t('fileUploader.validation.selectValid')}
                </p>
              </div>
            </>
          ) : selectedFile ? (
            <>
              <div className="p-4 bg-green-100 border-2 border-black rounded-full">
                <FileCheck className="w-8 h-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-3 text-green-800">
                  <File className="w-6 h-6" />
                  <span className="text-lg font-black max-w-xs truncate">{selectedFile.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile();
                    }}
                    className="p-1 hover:bg-red-200 rounded-full text-red-600 transition-colors border-2 border-transparent hover:border-red-600"
                    title={t('fileUploader.remove')}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm font-bold text-green-700">
                  {formatFileSize(selectedFile.size)} • {t('fileUploader.clickToReselect')}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 bg-yellow-300 border-2 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Upload className="w-8 h-8 text-black" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-black uppercase">
                  {t('fileUploader.dragDrop.title')}
                </h3>
                <p className="text-gray-600 font-bold">
                  {t('fileUploader.dragDrop.subtitle')} <span className="text-blue-600 underline decoration-2">{t('fileUploader.dragDrop.clickToSelect')}</span>
                </p>
                <div className="flex items-center justify-center space-x-4 pt-4">
                  <div className="flex items-center text-xs font-bold text-gray-500 bg-white px-2 py-1 border border-black">
                    {t('fileUploader.maxSize')}
                  </div>
                  <div className="flex items-center text-xs font-bold text-gray-500 bg-white px-2 py-1 border border-black">
                    {t('fileUploader.pdfOnly')}
                  </div>
                  <div className="flex items-center text-xs font-bold text-gray-500 bg-white px-2 py-1 border border-black">
                    {t('fileUploader.localProcessing')}
                  </div>
                </div>
                <div className="mt-6 p-3 bg-blue-50 border-2 border-black">
                  <div className="flex items-center text-blue-900 font-bold">
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
        <div className="mt-4 p-4 bg-red-50 border-2 border-black shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
            <p className="text-red-900 text-sm font-black">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

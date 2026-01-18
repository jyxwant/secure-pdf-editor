'use client';

import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, FileX, AlertCircle, CheckCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { FileUploader } from '@/components/pdf/FileUploader';
import { PDFViewer } from '@/components/pdf/PDFViewer';
import { Toolbar } from '@/components/pdf/Toolbar';
import { usePDFProcessor, type RedactionRect } from '@/hooks/usePDFProcessor';
import { LanguageSelector } from '@/components/LanguageSelector';

type ViewState = 'upload' | 'editor';
type RedactionMethod = 'canvas' | 'pixelate';

export default function EditorPage() {
  const { t } = useTranslation();
  
  // State Management
  const [viewState, setViewState] = useState<ViewState>('upload');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [redactionRects, setRedactionRects] = useState<RedactionRect[][]>([]);
  const [redactionHistory, setRedactionHistory] = useState<RedactionRect[][][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [redactionMethod, setRedactionMethod] = useState<RedactionMethod>('canvas');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>('red');

  // PDF Processor
  const { loadPDF, renderPage, processRedaction, loading, progress, isWorkerReady } = usePDFProcessor();

  // History Management
  const saveToHistory = useCallback((newRects: RedactionRect[][]) => {
    const newHistory = redactionHistory.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newRects)));
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(historyIndex + 1);
    }
    setRedactionHistory(newHistory);
  }, [redactionHistory, historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setRedactionRects(JSON.parse(JSON.stringify(redactionHistory[newIndex])));
      setSuccess(t('action.undoSuccess'));
      setTimeout(() => setSuccess(''), 2000);
    }
  }, [historyIndex, redactionHistory, t]);

  const handleRedo = useCallback(() => {
    if (historyIndex < redactionHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setRedactionRects(JSON.parse(JSON.stringify(redactionHistory[newIndex])));
      setSuccess(t('action.redoSuccess'));
      setTimeout(() => setSuccess(''), 2000);
    }
  }, [historyIndex, redactionHistory, t]);

  const clearMessages = useCallback(() => {
    setError('');
    setSuccess('');
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    clearMessages();
    try {
      if (file.size > 50 * 1024 * 1024) {
        setError(t('fileUploader.validation.sizeError'));
        return;
      }
      if (file.type !== 'application/pdf') {
        setError(t('fileUploader.validation.selectValid'));
        return;
      }
      setPdfFile(file);
      setSuccess(t('fileUploader.loading.description'));
      const result = await loadPDF(file);
      if (result.success && result.numPages) {
        setTotalPages(result.numPages);
        setCurrentPage(1);
        setRedactionRects(Array(result.numPages).fill(null).map(() => []));
        setViewState('editor');
        setSuccess(t('pdf.loading', { totalPages: result.numPages }));
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(result.error || t('pdf.loadError'));
        setPdfFile(null);
      }
    } catch (error: any) {
      console.error('File processing error:', error);
      setError(error.message || t('common.processError'));
      setPdfFile(null);
    }
  }, [loadPDF, clearMessages, t]);

  const handleAddRedactionRect = useCallback((pageNum: number, rect: RedactionRect) => {
    const rectWithColor = { ...rect, color: selectedColor };
    setRedactionRects(prev => {
      const newRects = [...prev];
      if (!newRects[pageNum - 1]) newRects[pageNum - 1] = [];
      newRects[pageNum - 1] = [...newRects[pageNum - 1], rectWithColor];
      saveToHistory(newRects);
      return newRects;
    });
    setSuccess(t('pdf.markAdded', { pageNum }));
    setTimeout(() => setSuccess(''), 2000);
  }, [saveToHistory, selectedColor, t]);

  const handleRemoveRedactionRect = useCallback((pageNum: number, rectId: string) => {
    setRedactionRects(prev => {
      const newRects = [...prev];
      if (newRects[pageNum - 1]) {
        newRects[pageNum - 1] = newRects[pageNum - 1].filter(rect => rect.id !== rectId);
      }
      saveToHistory(newRects);
      return newRects;
    });
    setSuccess(t('pdf.markRemoved', { pageNum }));
    setTimeout(() => setSuccess(''), 2000);
  }, [saveToHistory, t]);

  const handleClearAll = useCallback(() => {
    if (window.confirm(t('toolbar.confirmClearAll'))) {
      const newRects = Array(totalPages).fill(null).map(() => []);
      setRedactionRects(newRects);
      saveToHistory(newRects);
      setSuccess(t('toolbar.clearSuccess'));
      setTimeout(() => setSuccess(''), 2000);
    }
  }, [totalPages, saveToHistory, t]);

  const handlePreview = useCallback(() => {
    setShowPreview(true);
  }, []);

  const handleProcess = useCallback(async () => {
    if (!pdfFile) {
      setError(t('pdf.noFileError'));
      return;
    }
    const totalRedactions = redactionRects.reduce((total, pageRects) => total + pageRects.length, 0);
    if (totalRedactions === 0) {
      setError(t('pdf.noMarksError'));
      return;
    }
    if (!window.confirm(t('pdf.confirmProcess', { method: t('process.canvas'), count: totalRedactions }))) {
      return;
    }
    setProcessing(true);
    clearMessages();
    setSuccess(t('process.processingPdf'));
    try {
      const result = await processRedaction(pdfFile, redactionRects, redactionMethod);
      if (result.success && result.pdfBytes) {
        const blob = new Blob([result.pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${t('common.secureEdit')}_${pdfFile.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        setSuccess(`✓ ${result.message || t('pdf.processSuccess')}`);
      } else {
        setError(result.error || t('pdf.processError'));
      }
    } catch (error: any) {
      console.error('PDF processing error:', error);
      setError(error.message || t('pdf.processError'));
    } finally {
      setProcessing(false);
    }
  }, [pdfFile, redactionRects, redactionMethod, processRedaction, clearMessages, t]);

  const handleBackToUpload = useCallback(() => {
    const totalRedactions = redactionRects.reduce((total, pageRects) => total + pageRects.length, 0);
    if (totalRedactions > 0 && !window.confirm(t('common.confirmBack'))) {
      return;
    }
    setPdfFile(null);
    setTotalPages(0);
    setCurrentPage(1);
    setRedactionRects([]);
    setViewState('upload');
    clearMessages();
  }, [redactionRects, clearMessages, t]);

  const handleReload = useCallback(async () => {
    if (!pdfFile) return;
    clearMessages();
    setSuccess(t('pdf.reloading'));
    try {
      const result = await loadPDF(pdfFile);
      if (result.success) {
        setSuccess(t('pdf.reloadSuccess'));
      } else {
        setError(result.error || t('pdf.reloadError'));
      }
    } catch (error: any) {
      setError(error.message || t('pdf.reloadError'));
    }
  }, [pdfFile, loadPDF, clearMessages, t]);

  const totalRedactions = redactionRects.reduce((total, pageRects) => total + pageRects.length, 0);
  
  const previewData = useMemo(() => {
    const pageStats = redactionRects.map((pageRects, index) => ({
      page: index + 1,
      count: pageRects.length
    })).filter(stat => stat.count > 0);
    
    const methodDescriptions: any = {
      canvas: {
        name: t('process.canvas'),
        description: t('process.canvas.desc'),
        pros: t('process.canvas.pros'),
        cons: t('process.canvas.cons'),
        security: 5,
        color: 'green'
      },
      pixelate: {
        name: t('process.pixelate'),
        description: t('process.pixelate.desc'),
        pros: t('process.pixelate.pros'),
        cons: t('process.pixelate.cons'),
        security: 3,
        color: 'yellow'
      }
    };
    
    return {
      totalRedactions,
      pageStats,
      currentMethod: methodDescriptions[redactionMethod],
      totalPages
    };
  }, [redactionRects, redactionMethod, totalPages, t]);

  useEffect(() => {
    clearMessages();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clearMessages, handleUndo, handleRedo]);

  if (!isWorkerReady) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 neo-box">
          <div className="animate-spin w-12 h-12 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{t('app.initializing')}</h3>
          <p className="text-gray-600 text-sm font-medium">{t('app.initializingDesc')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-[calc(100vh-64px)] overflow-hidden" translate="no">
      {/* Editor Top Bar - Only visible in editor mode */}
      {viewState === 'editor' && (
        <div className="bg-white border-b-2 border-black px-4 py-2 sticky top-0 z-40 shadow-sm flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-3">
             <button
              onClick={handleBackToUpload}
              className="neo-btn-sm bg-white hover:bg-gray-100 flex items-center"
            >
              <FileX className="w-4 h-4 mr-1.5" />
              {t('app.back')}
            </button>
            <div className="h-6 w-0.5 bg-black mx-2"></div>
            <button
              onClick={handleReload}
              disabled={loading}
              className="neo-btn-sm bg-white hover:bg-gray-100 disabled:opacity-50"
              title={t('action.reload')}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-3">
             {totalRedactions === 0 && (
              <div className="hidden sm:flex items-center text-xs font-bold text-blue-800 bg-blue-100 border-2 border-blue-800 px-2 py-1 shadow-[2px_2px_0px_0px_rgba(30,64,175,1)]">
                <AlertCircle className="w-3 h-3 mr-1" />
                {t('app.subtitle')}
              </div>
            )}
            {totalRedactions > 0 && totalRedactions < 3 && (
              <div className="hidden sm:flex items-center text-xs font-bold text-green-800 bg-green-100 border-2 border-green-800 px-2 py-1 shadow-[2px_2px_0px_0px_rgba(22,101,52,1)]">
                <CheckCircle className="w-3 h-3 mr-1" />
                {t('pdf.canPreview')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Progress Modal */}
      {(progress || processing) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="neo-box max-w-md w-full mx-4 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="animate-spin w-6 h-6 border-4 border-black border-t-transparent rounded-full mr-3"></div>
                <h3 className="text-lg font-bold text-gray-900">
                  {progress 
                    ? progress.stage === 'loading' ? t('common.loading') 
                    : progress.stage === 'rendering' ? t('process.rendering')
                    : progress.stage === 'processing' ? t('action.processing')
                    : t('process.finishing')
                    : t('action.processing')
                  }
                </h3>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-gray-600">
                    {progress ? progress.message : t('process.processingPdf')}
                  </span>
                  <span className="text-sm font-black text-gray-800">
                    {progress ? `${Math.round(progress.progress)}%` : ''}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 border-2 border-black h-4 rounded-none">
                  <div 
                    className="bg-[#FFDE00] h-full transition-all duration-200 ease-out border-r-2 border-black"
                    style={{ 
                      width: progress ? `${progress.progress}%` : '20%',
                    }}
                  ></div>
                </div>
                
                {progress?.currentPage && progress?.totalPages && (
                  <div className="text-xs font-bold text-gray-500 mt-2 text-center">
                    {t('pdf.pageProgress', { current: progress.currentPage, total: progress.totalPages })}
                  </div>
                )}
              </div>
              
              <p className="text-xs font-bold text-gray-500 text-center">
                {t('process.warning')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="neo-box max-w-6xl w-full mx-4 h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b-2 border-black bg-yellow-50">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900 flex items-center">
                  <Shield className="w-6 h-6 text-black mr-2" />
                  {t('preview.title')}
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="neo-btn-sm bg-white hover:bg-red-100 text-black"
                >
                  <FileX className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm font-bold text-gray-700 mt-2">
                {t('preview.description')}
              </p>
            </div>
            
            <div className="flex-1 overflow-hidden bg-gray-100">
              <PDFViewer
                file={pdfFile}
                onRenderPage={renderPage}
                redactionRects={redactionRects}
                onAddRedactionRect={() => {}}
                onRemoveRedactionRect={() => {}}
                setRedactionRects={() => {}}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                loading={loading}
                previewMode={true}
                redactionMethod={redactionMethod}
              />
            </div>
            
            <div className="p-4 border-t-2 border-black bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm font-bold text-gray-600">
                  <span>{t('pdf.currentPage', { current: currentPage, total: totalPages })}</span>
                  <span>•</span>
                  <span>{t('preview.redactionCount', { count: previewData.totalRedactions })}</span>
                  <span>•</span>
                  <span>{t('preview.method', { method: previewData.currentMethod.name })}</span>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="neo-btn bg-white hover:bg-gray-100"
                  >
                    {t('preview.continueEdit')}
                  </button>
                  <button
                    onClick={() => {
                      setShowPreview(false);
                      if (previewData.totalRedactions > 0) {
                        handleProcess();
                      }
                    }}
                    disabled={previewData.totalRedactions === 0 || processing}
                    className="neo-btn bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? t('action.processing') : t('preview.confirmProcess')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Notifications */}
      {(error || success) && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[70] max-w-lg w-full mx-4 animate-in slide-in-from-top-4 duration-300">
          {error && (
            <div className="neo-box border-red-500 bg-red-50 p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-red-900 text-sm font-black">{t('action.error')}</p>
                  <p className="text-red-800 text-sm mt-1 font-medium">{error}</p>
                </div>
                <button onClick={clearMessages} className="ml-4 text-red-500 hover:text-red-700 font-bold">
                  <FileX className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {success && (
            <div className="neo-box border-green-500 bg-green-50 p-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-green-900 text-sm font-black">{t('action.success')}</p>
                  <p className="text-green-800 text-sm mt-1 font-medium">{success}</p>
                </div>
                <button onClick={clearMessages} className="ml-4 text-green-500 hover:text-green-700 font-bold">
                  <FileX className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <main className="flex-1 w-full overflow-hidden">
        {viewState === 'upload' ? (
          <div className="h-full overflow-auto flex flex-col items-center justify-center p-6 bg-[#f0f0f0] relative">
             <div className="absolute top-4 right-4">
               <LanguageSelector />
             </div>
             <div className="max-w-4xl w-full">
                <div className="text-center mb-8">
                  <Link href="/" className="inline-flex items-center text-gray-500 hover:text-black mb-6 font-bold transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('app.back')}
                  </Link>
                  <h1 className="text-4xl font-black text-gray-900 mb-2">{t('upload.title')}</h1>
                  <p className="text-xl text-gray-600 font-medium">{t('upload.description')}</p>
                </div>
                
                <div className="neo-box p-8 mb-8">
                  <FileUploader 
                    onFileSelect={handleFileSelect}
                    loading={loading}
                    error=""
                  />
                </div>
                
                {/* Compact Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="neo-box-sm p-4 flex items-center justify-center">
                    <Shield className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="font-bold text-sm">{t('fileUploader.localProcessing')}</span>
                  </div>
                  <div className="neo-box-sm p-4 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    <span className="font-bold text-sm">{t('fileUploader.pdfOnly')}</span>
                  </div>
                  <div className="neo-box-sm p-4 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
                    <span className="font-bold text-sm">{t('fileUploader.maxSize')}</span>
                  </div>
                </div>
             </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row h-full">
            <div className="flex-1 min-h-0 bg-gray-100/50 relative">
              <PDFViewer
                file={pdfFile}
                onRenderPage={renderPage}
                redactionRects={redactionRects}
                onAddRedactionRect={handleAddRedactionRect}
                onRemoveRedactionRect={handleRemoveRedactionRect}
                setRedactionRects={setRedactionRects}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                loading={loading}
              />
            </div>

            {/* Mobile Toolbar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black shadow-lg z-40">
              <div className="flex items-center justify-between px-4 py-2">
                <div className="text-xs font-bold text-gray-600">
                  {t('toolbar.marks', { count: totalRedactions })}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleUndo}
                    disabled={historyIndex <= 0 || processing}
                    className="neo-btn-sm bg-white text-gray-800 disabled:opacity-50"
                  >
                    {t('toolbar.undo')}
                  </button>
                  <button
                    onClick={handleRedo}
                    disabled={historyIndex >= redactionHistory.length - 1 || processing}
                    className="neo-btn-sm bg-white text-gray-800 disabled:opacity-50"
                  >
                    {t('toolbar.redo')}
                  </button>
                  <button
                    onClick={handleProcess}
                    disabled={!totalRedactions || processing}
                    className="neo-btn-sm bg-blue-600 text-white disabled:opacity-50"
                  >
                    {processing ? t('action.processing') : t('toolbar.generate')}
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Toolbar */}
            <div className="hidden lg:block h-full border-l-2 border-black bg-white w-80 shrink-0 overflow-y-auto">
              <Toolbar
                redactionMethod={redactionMethod}
                onMethodChange={(method: RedactionMethod) => setRedactionMethod(method)}
                onProcess={handleProcess}
                onClear={handleClearAll}
                onPreview={handlePreview}
                onUndo={handleUndo}
                onRedo={handleRedo}
                processing={processing}
                hasRedactions={totalRedactions > 0}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < redactionHistory.length - 1}
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

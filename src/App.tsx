import { I18nTest } from './components/I18nTest';
import { Analytics } from '@vercel/analytics/react';
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Shield, FileX, AlertCircle, CheckCircle, RefreshCw, Github } from 'lucide-react';
import { HomePage } from './pages/HomePage';
import { EditorPage } from './pages/EditorPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { GuidePage } from './pages/GuidePage';
import { FAQPage } from './pages/FAQPage';
import { ChinesePage } from './pages/ChinesePage';
import { FrenchPage } from './pages/FrenchPage';
import { LanguageSelector } from './components/LanguageSelector';
import { usePDFProcessor, type RedactionRect, type ProcessingProgress } from './hooks/usePDFProcessor';
import './App.css';

type ViewState = 'upload' | 'editor';
type RedactionMethod = 'canvas' | 'pixelate';

function AppContent() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  // 状态管理
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
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>('red');

  // PDF处理器
  const { loadPDF, renderPage, processRedaction, loading, progress, isWorkerReady } = usePDFProcessor();

  // 根据路由设置语言
  useEffect(() => {
    const path = location.pathname;
    if (path === '/zh' && i18n.language !== 'zh') {
      i18n.changeLanguage('zh');
    } else if (path === '/fr' && i18n.language !== 'fr') {
      i18n.changeLanguage('fr');
    } else if (path === '/' && i18n.language !== 'en') {
      i18n.changeLanguage('en');
    }
  }, [location.pathname, i18n]);

  // 当编辑器有文件时，防止用户通过URL直接访问其他页面
  useEffect(() => {
    if (viewState === 'editor' && pdfFile) {
      // 如果当前不在编辑页面，且有PDF文件，跳转到编辑页面
      if (location.pathname !== '/editor') {
        navigate('/editor');
      }
    }
  }, [viewState, pdfFile, location.pathname, navigate]);

  // 保存历史记录
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

  // 撤销操作
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setRedactionRects(JSON.parse(JSON.stringify(redactionHistory[newIndex])));
      setSuccess(t('action.undoSuccess'));
      setTimeout(() => setSuccess(''), 2000);
    }
  }, [historyIndex, redactionHistory]);

  // 重做操作
  const handleRedo = useCallback(() => {
    if (historyIndex < redactionHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setRedactionRects(JSON.parse(JSON.stringify(redactionHistory[newIndex])));
      setSuccess(t('action.redoSuccess'));
      setTimeout(() => setSuccess(''), 2000);
    }
  }, [historyIndex, redactionHistory]);

  // 清除消息
  const clearMessages = useCallback(() => {
    setError('');
    setSuccess('');
  }, []);

  // 处理文件选择
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
        navigate('/editor'); // 导航到编辑页面
        setSuccess(t('pdf.loading', { totalPages: result.numPages }));
      } else {
        setError(result.error || t('pdf.loadError'));
        setPdfFile(null);
      }
    } catch (error: any) {
      console.error('文件处理错误:', error);
      setError(error.message || t('common.processError'));
      setPdfFile(null);
    }
  }, [loadPDF, clearMessages, navigate]);

  // 添加标记矩形
  const handleAddRedactionRect = useCallback((pageNum: number, rect: RedactionRect) => {
    const rectWithColor = { ...rect, color: selectedColor };
    setRedactionRects(prev => {
      const newRects = [...prev];
      if (!newRects[pageNum - 1]) {
        newRects[pageNum - 1] = [];
      }
      newRects[pageNum - 1] = [...newRects[pageNum - 1], rectWithColor];
      
      saveToHistory(newRects);
      
      return newRects;
    });
    
    setSuccess(t('pdf.markAdded', { pageNum }));
    setTimeout(() => setSuccess(''), 2000);
  }, [saveToHistory, selectedColor]);

  // 删除标记矩形
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
  }, [saveToHistory]);

  // 清除所有标记
  const handleClearAll = useCallback(() => {
    if (window.confirm(t('toolbar.confirmClearAll'))) {
      const newRects = Array(totalPages).fill(null).map(() => []);
      setRedactionRects(newRects);
      
      saveToHistory(newRects);
      
      setSuccess(t('toolbar.clearSuccess'));
      setTimeout(() => setSuccess(''), 2000);
    }
  }, [totalPages, saveToHistory]);

  // 预览效果
  const handlePreview = useCallback(() => {
    setShowPreview(true);
  }, []);

  // 处理PDF
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

    if (!window.confirm(t('pdf.confirmProcess', { method: redactionMethod === 'canvas' ? t('process.canvas') : t('process.pixelate'), count: totalRedactions }))) {
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
      console.error('PDF处理错误:', error);
      setError(error.message || t('pdf.processError'));
    } finally {
      setProcessing(false);
    }
  }, [pdfFile, redactionRects, redactionMethod, processRedaction, clearMessages]);

  // 返回上传页面
  const handleBackToUpload = useCallback(() => {
    const totalRedactions = redactionRects.reduce((total, pageRects) => total + pageRects.length, 0);
    const hasWork = totalRedactions > 0;
    
    if (hasWork && !window.confirm(t('common.confirmBack'))) {
      return;
    }
    
    setPdfFile(null);
    setTotalPages(0);
    setCurrentPage(1);
    setRedactionRects([]);
    setViewState('upload');
    navigate('/'); // 返回首页
    clearMessages();
  }, [redactionRects, clearMessages, navigate]);

  // 重新加载当前文件
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
  }, [pdfFile, loadPDF, clearMessages]);

  // 计算统计信息
  const totalRedactions = redactionRects.reduce((total, pageRects) => total + pageRects.length, 0);
  
  // 计算预览数据
  const previewData = useMemo(() => {
    const pageStats = redactionRects.map((pageRects, index) => ({
      page: index + 1,
      count: pageRects.length
    })).filter(stat => stat.count > 0);
    
    const methodDescriptions = {
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
  }, [redactionRects, redactionMethod, totalPages]);

  // 页面加载时的初始化
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
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [clearMessages, handleUndo, handleRedo]);

  // 调试模式
  const debugMode = new URLSearchParams(window.location.search).get('debug') === 'i18n';
  
  if (debugMode) {
    return <I18nTest />;
  }

  if (!isWorkerReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('app.initializing')}</h3>
          <p className="text-gray-600 text-sm">
            {t('app.initializingDesc')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" translate="no">
      {/* 精简顶部导航栏 */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200/70 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                  <Shield className="w-4 h-4 text-gray-600" />
                </div>
                <h1 className="text-lg font-semibold text-gray-900 tracking-tight">{t('app.title')}</h1>
              </Link>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* 导航链接 */}
              <div className="hidden md:flex items-center space-x-4 mr-4">
                <Link to="/features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Features
                </Link>
                <Link to="/guide" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Guide
                </Link>
                <Link to="/faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  FAQ
                </Link>
              </div>
              
              <a
                href="https://github.com/jyxwant/secure-pdf-editor"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title={t('app.viewOnGitHub')}
              >
                <Github className="w-5 h-5" />
              </a>
              <LanguageSelector />
              {viewState === 'editor' && (
                <>
                  {totalRedactions === 0 && (
                    <div className="hidden sm:flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      {t('app.subtitle')}
                    </div>
                  )}
                  {totalRedactions > 0 && totalRedactions < 3 && (
                    <div className="hidden sm:flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {t('pdf.canPreview')}
                    </div>
                  )}
                  
                  <button
                    onClick={handleReload}
                    disabled={loading}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    title={t('action.reload')}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleBackToUpload}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FileX className="w-4 h-4 mr-1 inline" />
                    {t('app.back')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 进度模态框 */}
      {(progress || processing) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mr-3"></div>
                <h3 className="text-lg font-semibold text-gray-900">
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
                  <span className="text-sm text-gray-600">
                    {progress ? progress.message : t('process.processingPdf')}
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {progress ? `${Math.round(progress.progress)}%` : ''}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ 
                      width: progress ? `${progress.progress}%` : '20%',
                      animation: !progress ? 'pulse 2s infinite' : 'none'
                    }}
                  ></div>
                </div>
                
                {progress?.currentPage && progress?.totalPages && (
                  <div className="text-xs text-gray-500 mt-2 text-center animate-in fade-in duration-200">
                    {t('pdf.pageProgress', { current: progress.currentPage, total: progress.totalPages })}
                  </div>
                )}
              </div>
              
              <p className="text-xs text-gray-500 text-center">
                {t('process.warning')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 预览模态框 */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full mx-4 max-h-[95vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <svg className="w-6 h-6 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {t('preview.title')}
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-orange-700 mt-2">
                {t('preview.description')}
              </p>
            </div>
            
            <div className="flex-1 h-[calc(95vh-160px)] overflow-hidden">
              {/* PDF预览组件 */}
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{t('pdf.currentPage', { current: currentPage, total: totalPages })}</span>
                  <span>•</span>
                  <span>{t('preview.redactionCount', { count: previewData.totalRedactions })}</span>
                  <span>•</span>
                  <span>{t('preview.method', { method: previewData.currentMethod.name })}</span>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
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
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    {processing ? t('action.processing') : t('preview.confirmProcess')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 浮动消息提示 */}
      {(error || success) && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-lg w-full mx-4 animate-in slide-in-from-top-4 duration-300">
          {error && (
            <div className="bg-red-50/95 backdrop-blur-sm border border-red-200/70 p-4 rounded-lg shadow-lg animate-in fade-in duration-200">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-red-800 text-sm font-medium">{t('action.error')}</p>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
                <button
                  onClick={clearMessages}
                  className="ml-4 text-red-400 hover:text-red-600 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50/95 backdrop-blur-sm border border-green-200/70 p-4 rounded-lg shadow-lg animate-in fade-in duration-200">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-green-800 text-sm font-medium">{t('action.success')}</p>
                  <p className="text-green-700 text-sm mt-1">{success}</p>
                </div>
                <button
                  onClick={clearMessages}
                  className="ml-4 text-green-400 hover:text-green-600 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 主要内容区域 - 路由 */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={
            <HomePage 
              onFileSelect={handleFileSelect} 
              loading={loading}
            />
          } />
          <Route path="/zh" element={
            <ChinesePage 
              onFileSelect={handleFileSelect} 
              loading={loading}
            />
          } />
          <Route path="/fr" element={
            <FrenchPage 
              onFileSelect={handleFileSelect} 
              loading={loading}
            />
          } />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/editor" element={
            <EditorPage 
              pdfFile={pdfFile}
              onRenderPage={renderPage}
              redactionRects={redactionRects}
              onAddRedactionRect={handleAddRedactionRect}
              onRemoveRedactionRect={handleRemoveRedactionRect}
              setRedactionRects={setRedactionRects}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              loading={loading}
              redactionMethod={redactionMethod}
              onMethodChange={setRedactionMethod}
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
              totalRedactions={totalRedactions}
            />
          } />
        </Routes>
      </main>
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-200/70">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${i18n.language === 'fr' ? 'py-2.5' : 'py-4'}`}>
          <div className={`flex flex-col md:flex-row items-center justify-between ${i18n.language === 'fr' ? 'space-y-2 md:space-y-0' : 'space-y-3 md:space-y-0'}`}>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className={`${i18n.language === 'fr' ? 'w-4 h-4' : 'w-5 h-5'} bg-gray-100 rounded-md flex items-center justify-center`}>
                  <Shield className={`${i18n.language === 'fr' ? 'w-2 h-2' : 'w-2.5 h-2.5'} text-gray-600`} />
                </div>
                <div>
                  <span className={`${i18n.language === 'fr' ? 'text-xs' : 'text-sm'} font-semibold text-gray-800`}>{t('app.title')}</span>
                  <p className="text-xs text-gray-500">{t('security.localProcessing')}</p>
                </div>
              </div>
            </div>
            
            <div className={`flex-1 ${i18n.language === 'fr' ? 'max-w-md mx-3' : 'max-w-lg mx-4'} text-center`}>
              <div className={`bg-white/80 rounded-lg ${i18n.language === 'fr' ? 'px-3 py-1.5' : 'px-4 py-2'} border border-gray-200/50 shadow-sm`}>
                <div className="flex items-center justify-center space-x-2">
                  <Github className={`${i18n.language === 'fr' ? 'w-3 h-3' : 'w-4 h-4'} text-gray-700`} />
                  <span className={`${i18n.language === 'fr' ? 'text-xs' : 'text-sm'} font-medium text-gray-800`}>{t('footer.openSource')}</span>
                </div>
                <p className={`text-xs text-gray-600 ${i18n.language === 'fr' ? 'mt-0.5 leading-tight' : 'mt-1 leading-relaxed'}`}>
                  {t('footer.feedback')}
                </p>
              </div>
            </div>
            
            <div className={`flex items-center ${i18n.language === 'fr' ? 'space-x-2' : 'space-x-3'}`}>
              <a
                href="https://github.com/jyxwant/secure-pdf-editor"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center space-x-2 bg-gray-800 text-white ${i18n.language === 'fr' ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-sm'} rounded-lg hover:bg-gray-700 transition-colors font-medium shadow-sm`}
                title={t('app.viewOnGitHub')}
              >
                <Github className="w-4 h-4" />
                <span>{t('footer.repo')}</span>
              </a>
              <a
                href="https://github.com/jyxwant/secure-pdf-editor/issues"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center space-x-2 bg-blue-600 text-white ${i18n.language === 'fr' ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-sm'} rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm`}
                title={t('footer.issuesDesc')}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>{t('footer.issues')}</span>
              </a>
            </div>
          </div>
          
          {i18n.language !== 'fr' && (
            <div className="mt-3 pt-2 border-t border-gray-200/50 text-center">
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <span>© 2024 PDF Security Editor</span>
                <span>•</span>
                <span>{t('footer.madeWith')} ❤️</span>
              </div>
            </div>
          )}
          
          {i18n.language === 'fr' && (
            <div className="mt-2 pt-1 border-t border-gray-200/50 text-center">
              <div className="text-xs text-gray-500">
                <span>© 2024 • {t('footer.madeWith')} ❤️</span>
              </div>
            </div>
          )}
        </div>
      </footer>
      <Analytics />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AppContent />
      </Router>
    </HelmetProvider>
  );
}

export default App;
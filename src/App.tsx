import { I18nTest } from './components/I18nTest';
import { Analytics } from '@vercel/analytics/react';
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, FileX, AlertCircle, CheckCircle, RefreshCw, Github } from 'lucide-react';
import { FileUploader } from './components/pdf/FileUploader';
import { PDFViewer } from './components/pdf/PDFViewer';
import { Toolbar } from './components/pdf/Toolbar';
import { LanguageSelector } from './components/LanguageSelector';
import { FAQ } from './components/SEO/FAQ';
import { UserGuide } from './components/SEO/UserGuide';
import { Features } from './components/SEO/Features';
import { usePDFProcessor, type RedactionRect, type ProcessingProgress } from './hooks/usePDFProcessor';
import './App.css';

type ViewState = 'upload' | 'editor';
type RedactionMethod = 'canvas' | 'pixelate'; // 暂时隐藏 rebuild

function App() {
  const { t, i18n } = useTranslation();
  
  // 状态管理
  const [viewState, setViewState] = useState<ViewState>('upload');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [redactionRects, setRedactionRects] = useState<RedactionRect[][]>([]);
  const [redactionHistory, setRedactionHistory] = useState<RedactionRect[][][]>([]); // 历史记录
  const [historyIndex, setHistoryIndex] = useState(-1); // 当前历史位置
  const [redactionMethod, setRedactionMethod] = useState<RedactionMethod>('canvas');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>('red'); // 新增颜色状态

  // PDF处理器
  const { loadPDF, renderPage, processRedaction, loading, progress, isWorkerReady } = usePDFProcessor();

  // 保存历史记录
  const saveToHistory = useCallback((newRects: RedactionRect[][]) => {
    const newHistory = redactionHistory.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newRects))); // 深拷贝
    
    // 限制历史记录数量
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
      // 文件大小检查
      if (file.size > 50 * 1024 * 1024) {
        setError(t('fileUploader.validation.sizeError'));
        return;
      }

      // 文件类型检查
      if (file.type !== 'application/pdf') {
        setError(t('fileUploader.validation.selectValid'));
        return;
      }

      setPdfFile(file);
      
      // 显示加载提示
      setSuccess(t('fileUploader.loading.description'));
      
      // 加载PDF
      const result = await loadPDF(file);
      
      if (result.success && result.numPages) {
        setTotalPages(result.numPages);
        setCurrentPage(1);
        // 初始化每页的标记矩形数组
        setRedactionRects(Array(result.numPages).fill(null).map(() => []));
        setViewState('editor');
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
  }, [loadPDF, clearMessages]);

  // 添加标记矩形
  const handleAddRedactionRect = useCallback((pageNum: number, rect: RedactionRect) => {
    const rectWithColor = { ...rect, color: selectedColor }; // 添加当前选中的颜色
    setRedactionRects(prev => {
      const newRects = [...prev];
      if (!newRects[pageNum - 1]) {
        newRects[pageNum - 1] = [];
      }
      newRects[pageNum - 1] = [...newRects[pageNum - 1], rectWithColor];
      
      // 保存到历史记录
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
      
      // 保存到历史记录
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
      
      // 保存到历史记录
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

    if (!window.confirm(t('pdf.confirmProcess', { method: redactionMethod === 'canvas' ? t('process.canvas') : redactionMethod === 'pixelate' ? t('process.pixelate') : t('process.rebuild'), count: totalRedactions }))) {
      return;
    }

    setProcessing(true);
    clearMessages();
    setSuccess(t('process.processingPdf'));

    try {
      const result = await processRedaction(pdfFile, redactionRects, redactionMethod);
      
      if (result.success && result.pdfBytes) {
        // 创建下载链接
        const blob = new Blob([result.pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${t('common.secureEdit')}_${pdfFile.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // 清理URL对象
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
    clearMessages();
  }, [redactionRects, clearMessages]);

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
      // rebuild功能暂时隐藏
      // rebuild: {
      //   name: 'PDF重建法',
      //   description: '复制PDF结构，分析文本对象位置，在敏感区域添加覆盖层',
      //   pros: '保持PDF可编辑性，文件较小，保留原有格式',
      //   cons: '敏感文本可能仍存在于底层结构中',
      //   security: 3,
      //   color: 'yellow'
      // }
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
    // 清除任何之前的错误状态
    clearMessages();
    
    // 添加键盘快捷键监听
    const handleKeyDown = (e: KeyboardEvent) => {
      // 避免在输入框中触发
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      // Ctrl+Z 撤销
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      
      // Ctrl+Y 或 Ctrl+Shift+Z 重做
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

  // 调试模式 - 临时添加
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
              <Shield className="w-7 h-7 text-blue-600 mr-2" />
              <h1 className="text-lg font-semibold text-gray-900">{t('app.title')}</h1>
            </div>
            
            <div className="flex items-center space-x-3">
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
                  {/* 智能提示 */}
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

      {/* 进度模态框 - 优化动画 */}
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
              <PDFViewer
                file={pdfFile}
                onRenderPage={renderPage}
                redactionRects={redactionRects}
                onAddRedactionRect={() => {}} // 预览模式下禁用
                onRemoveRedactionRect={() => {}} // 预览模式下禁用
                setRedactionRects={() => {}} // 预览模式下禁用
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                loading={loading}
                previewMode={true} // 启用预览模式
              />
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

      {/* 浮动消息提示 - 优化动画 */}
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

      {/* 主要内容区域 */}
      <main className="flex-1">
        {viewState === 'upload' ? (
          <div className="max-w-4xl mx-auto p-6">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-blue-600 mr-2" />
                <h1 className="text-3xl font-bold text-gray-900">{t('upload.title')}</h1>
              </div>
              <p className="text-gray-600 mb-8">{t('upload.description')}</p>
            </div>

            {/* 简洁的信息说明区域 */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
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
              onFileSelect={handleFileSelect}
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
        ) : (
          <div className="flex flex-col lg:flex-row h-[calc(100vh-3.5rem)]">
            <div className="flex-1 min-h-0">
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

            {/* 移动端工具栏 - 底部固定 */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
              <div className="flex items-center justify-between px-4 py-2">
                <div className="text-xs text-gray-500">
                  {t('toolbar.marks', { count: totalRedactions })}
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={handleUndo}
                    disabled={historyIndex <= 0 || processing}
                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    title={t('action.undo')}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={handleRedo}
                    disabled={historyIndex >= redactionHistory.length - 1 || processing}
                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    title={t('action.redo')}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={handlePreview}
                    disabled={!totalRedactions}
                    className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded disabled:opacity-50"
                  >
                    {t('action.preview')}
                  </button>
                  <button
                    onClick={handleProcess}
                    disabled={!totalRedactions || processing}
                    className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded disabled:opacity-50"
                  >
                    {processing ? t('action.processing') : t('toolbar.generate')}
                  </button>
                </div>
              </div>
            </div>

            {/* 桌面端工具栏 - 右侧边栏 */}
            <div className="hidden lg:block">
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
      {/* 紧凑但美观的Footer - 法语界面特殊优化 */}
      <footer className="bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-200/70">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${i18n.language === 'fr' ? 'py-2.5' : 'py-4'}`}>
          <div className={`flex flex-col md:flex-row items-center justify-between ${i18n.language === 'fr' ? 'space-y-2 md:space-y-0' : 'space-y-3 md:space-y-0'}`}>
            {/* Left - Project Info */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Shield className={`${i18n.language === 'fr' ? 'w-4 h-4' : 'w-5 h-5'} text-blue-600`} />
                <div>
                  <span className={`${i18n.language === 'fr' ? 'text-xs' : 'text-sm'} font-semibold text-gray-800`}>{t('app.title')}</span>
                  <p className="text-xs text-gray-500">{t('security.localProcessing')}</p>
                </div>
              </div>
            </div>
            
            {/* Center - GitHub Message with better styling */}
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
            
            {/* Right - Styled Action Links */}
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
          
          {/* Copyright line - compact, 法语界面更紧凑 */}
          {i18n.language !== 'fr' && (
            <div className="mt-3 pt-2 border-t border-gray-200/50 text-center">
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <span>© 2024 PDF Security Editor</span>
                <span>•</span>
                <span>{t('footer.madeWith')} ❤️</span>
              </div>
            </div>
          )}
          
          {/* 法语界面的版权信息更紧凑 */}
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

export default App;

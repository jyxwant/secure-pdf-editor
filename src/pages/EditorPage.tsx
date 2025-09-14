import React from 'react';
import { useTranslation } from 'react-i18next';
import { PDFViewer } from '../components/pdf/PDFViewer';
import { Toolbar } from '../components/pdf/Toolbar';
import { SEOHead } from '../components/SEO/SEOHead';
import type { RedactionRect, ProcessingProgress } from '../hooks/usePDFProcessor';

type RedactionMethod = 'canvas' | 'pixelate';

interface EditorPageProps {
  pdfFile: File | null;
  onRenderPage: any;
  redactionRects: RedactionRect[][];
  onAddRedactionRect: (pageNum: number, rect: RedactionRect) => void;
  onRemoveRedactionRect: (pageNum: number, rectId: string) => void;
  setRedactionRects: React.Dispatch<React.SetStateAction<RedactionRect[][]>>;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading: boolean;
  redactionMethod: RedactionMethod;
  onMethodChange: (method: RedactionMethod) => void;
  onProcess: () => void;
  onClear: () => void;
  onPreview: () => void;
  onUndo: () => void;
  onRedo: () => void;
  processing: boolean;
  hasRedactions: boolean;
  canUndo: boolean;
  canRedo: boolean;
  selectedColor: string;
  onColorChange: (color: string) => void;
  totalRedactions: number;
}

export function EditorPage(props: EditorPageProps) {
  const { t } = useTranslation();
  const {
    pdfFile,
    onRenderPage,
    redactionRects,
    onAddRedactionRect,
    onRemoveRedactionRect,
    setRedactionRects,
    currentPage,
    totalPages,
    onPageChange,
    loading,
    redactionMethod,
    onMethodChange,
    onProcess,
    onClear,
    onPreview,
    onUndo,
    onRedo,
    processing,
    hasRedactions,
    canUndo,
    canRedo,
    selectedColor,
    onColorChange,
    totalRedactions
  } = props;

  return (
    <>
      <SEOHead 
        title={`${t('app.title')} - PDF Editor`}
        description="Professional PDF redaction editor with advanced security features. Mark sensitive areas and generate secure documents."
        keywords="PDF editor, redaction tool, document security, sensitive information removal"
        canonicalUrl="/editor"
        lang="en"
        alternates={{ en: 'https://secureredact.tech/editor' }}
      />
      <div className="flex flex-col lg:flex-row h-[calc(100vh-3.5rem)]">
        <div className="flex-1 min-h-0">
          <PDFViewer
            file={pdfFile}
            onRenderPage={onRenderPage}
            redactionRects={redactionRects}
            onAddRedactionRect={onAddRedactionRect}
            onRemoveRedactionRect={onRemoveRedactionRect}
            setRedactionRects={setRedactionRects}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            loading={loading}
          />
        </div>

        {/* 移动端工具栏 - 底部固定 */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="text-xs text-gray-500">
              {t('pdf.marks', { count: totalRedactions })}
            </div>
            <div className="flex space-x-1">
              <button
                onClick={onUndo}
                disabled={!canUndo || processing}
                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                title={t('action.undo')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>
              <button
                onClick={onRedo}
                disabled={!canRedo || processing}
                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                title={t('action.redo')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                </svg>
              </button>
              <button
                onClick={onPreview}
                disabled={!totalRedactions}
                className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded disabled:opacity-50"
              >
                {t('action.preview')}
              </button>
              <button
                onClick={onProcess}
                disabled={!totalRedactions || processing}
                className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded disabled:opacity-50"
              >
                {processing ? t('action.processing') : t('toolbar.generatePDF')}
              </button>
            </div>
          </div>
        </div>

        {/* 桌面端工具栏 - 右侧边栏 */}
        <div className="hidden lg:block">
          <Toolbar
            redactionMethod={redactionMethod}
            onMethodChange={onMethodChange}
            onProcess={onProcess}
            onClear={onClear}
            onPreview={onPreview}
            onUndo={onUndo}
            onRedo={onRedo}
            processing={processing}
            hasRedactions={hasRedactions}
            canUndo={canUndo}
            canRedo={canRedo}
            selectedColor={selectedColor}
            onColorChange={onColorChange}
          />
        </div>
      </div>
    </>
  );
}

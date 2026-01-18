import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, Maximize2, Move, Grid3X3, List } from 'lucide-react';
import type { RedactionRect } from '../../hooks/usePDFProcessor';
import { PageSelector } from './PageSelector';
import { ThumbnailView } from './ThumbnailView';
import { PDFPage } from './PDFPage';

interface PDFViewerProps {
  file: File | null;
  onRenderPage: (pageNum: number, scale?: number) => Promise<any>;
  redactionRects: RedactionRect[][];
  onAddRedactionRect: (pageNum: number, rect: RedactionRect) => void;
  onRemoveRedactionRect: (pageNum: number, rectId: string) => void;
  setRedactionRects: React.Dispatch<React.SetStateAction<RedactionRect[][]>>;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  previewMode?: boolean;
  redactionMethod?: 'canvas' | 'pixelate';
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  file,
  onRenderPage,
  redactionRects,
  onAddRedactionRect,
  onRemoveRedactionRect,
  setRedactionRects,
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
  previewMode = false,
  redactionMethod = 'canvas'
}) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1.2);
  const [isPanMode, setIsPanMode] = useState(false);
  const [viewMode, setViewMode] = useState<'single' | 'thumbnail'>('single');
  const [selectedRectId, setSelectedRectId] = useState<string | null>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Update page refs array when total pages changes
  useEffect(() => {
    pageRefs.current = pageRefs.current.slice(0, totalPages);
  }, [totalPages]);

  // Scroll to current page when it changes via external controls
  // We use a flag to prevent scrolling when the change came from scrolling itself
  const isScrollingRef = useRef(false);
  useEffect(() => {
    if (isScrollingRef.current) return;
    
    const pageEl = pageRefs.current[currentPage - 1];
    if (pageEl && containerRef.current) {
      // Check if already in view
      const container = containerRef.current;
      const rect = pageEl.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      const isInView = (
        rect.top >= containerRect.top &&
        rect.bottom <= containerRect.bottom
      );

      if (!isInView) {
        pageEl.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }
  }, [currentPage, totalPages, viewMode]);

  const scrollTimeoutRef = useRef<any>(null);

  // Handle scroll to update current page
  const handleScroll = useCallback(() => {
    if (!containerRef.current || viewMode !== 'single') return;
    
    isScrollingRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
    }, 150);

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.top + containerRect.height / 2;

    let bestPage = currentPage;
    let minDistance = Infinity;

    // Optimize: only check pages that are likely to be in view?
    // For now, checking all refs is fast enough for < 100 pages
    pageRefs.current.forEach((ref, index) => {
      if (!ref) return;
      const rect = ref.getBoundingClientRect();
      
      // Optimization: Skip if completely out of view (far away)
      if (rect.bottom < containerRect.top - 500 || rect.top > containerRect.bottom + 500) return;

      const center = rect.top + rect.height / 2;
      const distance = Math.abs(center - containerCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        bestPage = index + 1;
      }
    });

    if (bestPage !== currentPage) {
      onPageChange(bestPage);
    }
  }, [currentPage, onPageChange, viewMode]);

  const handleZoomIn = useCallback(() => setScale(s => Math.min(s * 1.25, 4.0)), []);
  const handleZoomOut = useCallback(() => setScale(s => Math.max(s / 1.25, 0.3)), []);
  const handleResetZoom = useCallback(() => setScale(1.2), []);
  const handleFitWidth = useCallback(() => {
    // Estimate based on the first page if available, or just set a safe default
    // In a real app, we might wait for the first page to render to get dimensions
    // For now, let's just reset to 1.0 which is usually close to fit width for standard screens
    // Or we could try to measure the container
    if (containerRef.current) {
        // Assuming standard A4 ratio (1 / 1.414)
        // This is a rough approximation
        const containerWidth = containerRef.current.clientWidth - 48; // padding
        // Standard PDF width at scale 1 is usually ~600-800px depending on DPI
        // Let's guess 800px base width
        const estimatedBaseWidth = 800;
        setScale(containerWidth / estimatedBaseWidth);
    }
  }, []);

  // Rect handlers
  const handleAddRect = useCallback((pageNum: number, rect: RedactionRect) => {
    onAddRedactionRect(pageNum, rect);
    setSelectedRectId(rect.id);
  }, [onAddRedactionRect]);

  const handleUpdateRect = useCallback((pageNum: number, updatedRect: RedactionRect) => {
    setRedactionRects(prev => {
        const newRects = [...prev];
        const pageIndex = pageNum - 1;
        if (newRects[pageIndex]) {
            const idx = newRects[pageIndex].findIndex(r => r.id === updatedRect.id);
            if (idx !== -1) {
                newRects[pageIndex][idx] = updatedRect;
            }
        }
        return newRects;
    });
  }, [setRedactionRects]);

  const handleRemoveRect = useCallback((pageNum: number, rectId: string) => {
    onRemoveRedactionRect(pageNum, rectId);
    if (selectedRectId === rectId) setSelectedRectId(null);
  }, [onRemoveRedactionRect, selectedRectId]);

  if (!file) return (
    <div className="flex items-center justify-center h-full bg-gray-50">
        <p className="text-gray-500 font-bold">{t('pdf.loading')}</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b-2 border-black shadow-sm shrink-0 z-10 relative">
        <div className="flex items-center space-x-2">
          <button onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage <= 1} className="neo-btn-sm bg-white hover:bg-gray-100 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
          <PageSelector currentPage={currentPage} totalPages={totalPages} onPageChange={(p) => {
              onPageChange(p);
              // Force scroll
              isScrollingRef.current = false;
          }} />
          <button onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage >= totalPages} className="neo-btn-sm bg-white hover:bg-gray-100 disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
        </div>
        <div className="flex items-center space-x-2">
            <button onClick={() => setViewMode(v => v === 'single' ? 'thumbnail' : 'single')} className="neo-btn-sm bg-white hover:bg-gray-100">
                {viewMode === 'single' ? <Grid3X3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
            </button>
            {viewMode === 'single' && (
                <>
                    <button onClick={handleZoomOut} className="neo-btn-sm bg-white hover:bg-gray-100"><ZoomOut className="w-4 h-4" /></button>
                    <span className="text-sm font-bold w-12 text-center">{Math.round(scale * 100)}%</span>
                    <button onClick={handleZoomIn} className="neo-btn-sm bg-white hover:bg-gray-100"><ZoomIn className="w-4 h-4" /></button>
                    <button onClick={handleResetZoom} className="neo-btn-sm bg-white hover:bg-gray-100 hidden sm:flex"><RotateCcw className="w-4 h-4" /></button>
                    <button onClick={handleFitWidth} className="neo-btn-sm bg-white hover:bg-gray-100 hidden sm:flex"><Maximize2 className="w-4 h-4" /></button>
                    <button onClick={() => setIsPanMode(!isPanMode)} className={`neo-btn-sm ${isPanMode ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'} hidden sm:flex`}><Move className="w-4 h-4" /></button>
                </>
            )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative bg-gray-100">
        <div 
            ref={containerRef} 
            className="absolute inset-0 overflow-auto flex flex-col items-center py-8 px-4"
            onScroll={handleScroll}
        >
          {viewMode === 'single' ? (
              <div className="flex flex-col gap-8">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <div key={pageNum} ref={(el) => { pageRefs.current[pageNum - 1] = el; }}>
                        <PDFPage
                            pageNumber={pageNum}
                            scale={scale}
                            onRenderPage={onRenderPage}
                            rects={redactionRects[pageNum - 1] || []}
                            onAddRect={(rect) => handleAddRect(pageNum, rect)}
                            onUpdateRect={(rect) => handleUpdateRect(pageNum, rect)}
                            onRemoveRect={(rectId) => handleRemoveRect(pageNum, rectId)}
                            selectedRectId={selectedRectId}
                            onSelectRect={setSelectedRectId}
                            previewMode={previewMode}
                            isPanMode={isPanMode}
                            redactionMethod={redactionMethod}
                        />
                      </div>
                  ))}
              </div>
          ) : (
              <ThumbnailView 
                  file={file} 
                  onRenderPage={onRenderPage} 
                  redactionRects={redactionRects} 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={(page) => { onPageChange(page); setViewMode('single'); }} 
                  loading={loading}
              />
          )}
        </div>
      </div>
    </div>
  );
};

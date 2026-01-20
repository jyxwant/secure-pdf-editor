import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ZoomIn, ZoomOut, RotateCcw, Grid3X3 } from 'lucide-react';
import type { RedactionRect } from '../../hooks/usePDFProcessor';

interface ThumbnailViewProps {
  file: File | null;
  onRenderPage: (pageNum: number, scale?: number) => Promise<any>;
  redactionRects: RedactionRect[][];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewModeChange?: () => void; // 新增：通知父组件切换视图模式
  loading?: boolean;
  previewMode?: boolean;
}

export const ThumbnailView: React.FC<ThumbnailViewProps> = ({
  file,
  onRenderPage,
  redactionRects,
  currentPage,
  totalPages,
  onPageChange,
  onViewModeChange, // 新增参数
  loading = false,
  previewMode = false
}) => {
  const { t } = useTranslation();
  const [scale, setScale] = useState(1.5);
  const [thumbnails, setThumbnails] = useState<Map<number, { url: string; hash: string }>>(new Map());
  const [renderingPages, setRenderingPages] = useState<Set<number>>(new Set());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentPageRef = useRef<HTMLDivElement>(null);
  const renderQueueRef = useRef<Set<number>>(new Set());

  // 计算页面标记哈希值，用于智能缓存
  const getPageHash = useCallback((pageNum: number) => {
    const pageRects = redactionRects[pageNum - 1] || [];
    return `${pageNum}-${scale.toFixed(2)}-${pageRects.length}-${JSON.stringify(pageRects)}`;
  }, [redactionRects, scale]);

  // 智能渲染缩略图 - 只渲染发生变化的页面
  const renderThumbnail = useCallback(async (pageNum: number) => {
    if (!file || renderingPages.has(pageNum) || renderQueueRef.current.has(pageNum)) return;
    
    const pageHash = getPageHash(pageNum);
    const existingThumbnail = thumbnails.get(pageNum);
    
    // 如果哈希值相同，说明页面未变化，跳过渲染
    if (existingThumbnail && existingThumbnail.hash === pageHash) {
      return;
    }
    
    renderQueueRef.current.add(pageNum);
    setRenderingPages(prev => new Set([...prev, pageNum]));

    try {
      // 使用适中的渲染分辨率
      const renderScale = Math.min(scale * 1.2, 1.5);
      const result = await onRenderPage(pageNum, renderScale);
      
      if (result.success && result.imageData) {
        // 创建离屏Canvas
        const canvas = document.createElement('canvas');
        const devicePixelRatio = window.devicePixelRatio || 1;
        const ctx = canvas.getContext('2d', {
          alpha: false,
          imageSmoothingEnabled: true,
          imageSmoothingQuality: 'high',
          willReadFrequently: false
        }) as CanvasRenderingContext2D;
        
        if (!ctx) return;

        // 设置高分辨率canvas以获得更清晰的缩略图
        const displayWidth = result.width * 0.8; // 稍微缩小以提升性能
        const displayHeight = result.height * 0.8;
        
        canvas.width = displayWidth * devicePixelRatio;
        canvas.height = displayHeight * devicePixelRatio;
        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;
        
        ctx.scale(devicePixelRatio, devicePixelRatio);
        
        // 先将原始图像绘制到临时canvas，然后缩放绘制到最终canvas
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = result.width;
        tempCanvas.height = result.height;
        const tempCtx = tempCanvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;
        tempCtx.putImageData(result.imageData, 0, 0);
        
        // 使用高质量缩放绘制到最终canvas
        ctx.drawImage(tempCanvas, 0, 0, displayWidth, displayHeight);

        // 绘制标记区域
        const pageRects = redactionRects[pageNum - 1] || [];
        if (pageRects.length > 0) {
          ctx.save();
          
          pageRects.forEach(rect => {
            const x = (rect.x / rect.pageWidth) * displayWidth;
            const y = (rect.y / rect.pageHeight) * displayHeight;
            const width = (rect.width / rect.pageWidth) * displayWidth;
            const height = (rect.height / rect.pageHeight) * displayHeight;

            if (previewMode) {
              ctx.fillStyle = '#000000';
              ctx.fillRect(x, y, width, height);
            } else {
              const color = rect.color || 'red';
              const colorMap = {
                red: 'rgba(239, 68, 68, 0.35)',
                blue: 'rgba(59, 130, 246, 0.35)',
                green: 'rgba(34, 197, 94, 0.35)',
                yellow: 'rgba(234, 179, 8, 0.35)',
                purple: 'rgba(168, 85, 247, 0.35)'
              };
              ctx.fillStyle = colorMap[color as keyof typeof colorMap] || colorMap.red;
              ctx.fillRect(x, y, width, height);

              ctx.strokeStyle = color === 'red' ? '#DC2626' : 
                               color === 'blue' ? '#3B82F6' :
                               color === 'green' ? '#22C55E' :
                               color === 'yellow' ? '#EAB308' : '#A855F7';
              ctx.lineWidth = Math.max(1, displayWidth / 500);
              ctx.strokeRect(x, y, width, height);
            }
          });
          
          ctx.restore();
        }

        // 使用高质量压缩
        const dataUrl = canvas.toDataURL('image/webp', 0.85);
        
        setThumbnails(prev => new Map([...prev, [pageNum, { url: dataUrl, hash: pageHash }]]));
      }
    } catch (error) {
      console.warn(`缩略图渲染失败 (第${pageNum}页):`, error);
    } finally {
      setRenderingPages(prev => {
        const newSet = new Set(prev);
        newSet.delete(pageNum);
        return newSet;
      });
      renderQueueRef.current.delete(pageNum);
    }
  }, [file, onRenderPage, redactionRects, previewMode, scale, getPageHash, thumbnails]);

  // 智能渲染策略：优先渲染当前页面和可见区域
  const renderVisibleThumbnails = useCallback(() => {
    if (!file || totalPages === 0) return;

    // 立即渲染当前页面
    renderThumbnail(currentPage);
    
    // 延迟渲染周围页面，避免阻塞
    requestAnimationFrame(() => {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      for (let page = startPage; page <= endPage; page++) {
        if (page !== currentPage) {
          // 使用小延迟避免同时渲染太多页面
          setTimeout(() => renderThumbnail(page), (Math.abs(page - currentPage) - 1) * 50);
        }
      }
    });
  }, [file, totalPages, currentPage, renderThumbnail]);

  // 当页面变化时渲染缩略图
  useEffect(() => {
    renderVisibleThumbnails();
  }, [renderVisibleThumbnails]);

  // 内存管理 - 限制缓存大小并清理过期缓存
  const maxCacheSize = 20; // 最大缓存页数
  const cleanupCache = useCallback(() => {
    if (thumbnails.size > maxCacheSize) {
      const sortedEntries = Array.from(thumbnails.entries()).sort((a, b) => {
        // 保留当前页面附近的缩略图
        const distanceA = Math.abs(a[0] - currentPage);
        const distanceB = Math.abs(b[0] - currentPage);
        return distanceB - distanceA; // 远离当前页面的排在前面（将被删除）
      });
      
      const toDelete = sortedEntries.slice(maxCacheSize);
      const newThumbnails = new Map(thumbnails);
      
      toDelete.forEach(([pageNum]) => {
        const thumbnail = newThumbnails.get(pageNum);
        if (thumbnail?.url.startsWith('blob:')) {
          URL.revokeObjectURL(thumbnail.url);
        }
        newThumbnails.delete(pageNum);
      });
      
      setThumbnails(newThumbnails);
    }
  }, [thumbnails, currentPage, maxCacheSize]);

  // 组件卸载时清理所有缓存
  useEffect(() => {
    return () => {
      thumbnails.forEach(thumbnail => {
        if (thumbnail.url.startsWith('blob:')) {
          URL.revokeObjectURL(thumbnail.url);
        }
      });
    };
  }, []);

  // 定期清理缓存
  useEffect(() => {
    const cleanup = setTimeout(cleanupCache, 5000); // 5秒后清理
    return () => clearTimeout(cleanup);
  }, [thumbnails.size, cleanupCache]);

  // 智能缓存更新 - 只更新有变化的页面
  const updateThumbnailsForChangedPages = useCallback(() => {
    if (!file) return;
    
    // 检查哪些页面的标记发生了变化
    const changedPages: number[] = [];
    
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const currentHash = getPageHash(pageNum);
      const existingThumbnail = thumbnails.get(pageNum);
      
      if (!existingThumbnail || existingThumbnail.hash !== currentHash) {
        changedPages.push(pageNum);
      }
    }
    
    // 只重新渲染变化的页面
    changedPages.forEach((pageNum, index) => {
      setTimeout(() => renderThumbnail(pageNum), index * 30);
    });
  }, [file, totalPages, getPageHash, thumbnails, renderThumbnail]);
  
  // 当标记区域变化时，智能更新缓存
  useEffect(() => {
    updateThumbnailsForChangedPages();
  }, [updateThumbnailsForChangedPages]);

  // 当缩放改变时，只需要更新显示，不用重新渲染
  useEffect(() => {
    // 缩放改变时不需要重新渲染缩略图，只是显示大小变化
  }, [scale]);

  // 优化滚动到当前页面的动画
  useEffect(() => {
    if (currentPageRef.current && scrollContainerRef.current) {
      const timeout = setTimeout(() => {
        currentPageRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }, 100); // 给渲染留出时间
      
      return () => clearTimeout(timeout);
    }
  }, [currentPage]);

  // 简化的缩放控制
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.8));
  const handleResetZoom = () => setScale(1.5);

  // 优化的页面点击处理 - 直接调用父组件传入的onPageChange
  const handlePageClick = useCallback((pageNum: number) => {
    console.log(`点击缩略图页面 ${pageNum}`);
    onPageChange(pageNum); // 这里会触发父组件的回调，自动切换视图
  }, [onPageChange]);

  if (!file) return null;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Thumbnail toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center space-x-2">
          <Grid3X3 className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">{t('view.thumbnailView')}</span>
          <span className="text-xs text-gray-500">({t('pdf.thumbnailViewPages', { total: totalPages })})</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
            title={t('view.zoomOut')}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="px-2 py-1 text-xs font-medium bg-gray-50 rounded-md min-w-[50px] text-center">
            {Math.round(scale * 100)}%
          </div>
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
            title={t('view.zoomIn')}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
            title={t('view.resetZoom')}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Thumbnail grid */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-auto p-6 scroll-smooth bg-gray-100"
      >
        <div 
          className="grid gap-6 transition-all duration-200 ease-out"
          style={{
            gridTemplateColumns: `repeat(auto-fill, minmax(${Math.max(140 * scale, 120)}px, 1fr))`
          }}
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
            const isCurrentPage = pageNum === currentPage;
            const thumbnailData = thumbnails.get(pageNum);
            const thumbnailUrl = thumbnailData?.url;
            const isRendering = renderingPages.has(pageNum);
            const pageRects = redactionRects[pageNum - 1] || [];

            return (
              <div
                key={pageNum}
                ref={isCurrentPage ? currentPageRef : null}
                className={`relative cursor-pointer group transition-all duration-300 ease-out ${
                  isCurrentPage 
                    ? 'transform scale-105 z-10' 
                    : 'hover:scale-105 hover:z-20'
                }`}
                onClick={() => handlePageClick(pageNum)}
              >
                <div className={`bg-white rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  isCurrentPage 
                    ? 'border-blue-500 shadow-xl' 
                    : 'border-gray-200 group-hover:border-blue-300 group-hover:shadow-lg'
                }`}>
                  {/* Thumbnail content */}
                  <div 
                    className="aspect-[3/4] bg-gray-100 flex items-center justify-center relative"
                    style={{ 
                      minHeight: `${Math.max(120 * scale, 80)}px`,
                      height: `${Math.max(160 * scale, 100)}px`
                    }}
                  >
                    {thumbnailUrl ? (
                      <img 
                        src={thumbnailUrl} 
                        alt={t('pdf.page', { number: pageNum })}
                        className="w-full h-full object-contain transition-opacity duration-300"
                        loading="lazy"
                        onLoad={(e) => {
                          // 添加淡入效果
                          (e.target as HTMLImageElement).style.opacity = '1';
                        }}
                        style={{ opacity: 0 }}
                      />
                    ) : isRendering ? (
                      <div className="text-center">
                        <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                        <span className="text-xs text-gray-500">{t('common.loading')}</span>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">
                        <div className="w-8 h-8 bg-gray-300 rounded mb-2 mx-auto animate-pulse"></div>
                        <span className="text-xs">{t('thumbnail.waitingLoad')}</span>
                      </div>
                    )}

                    {/* Mark count indicator */}
                    {pageRects.length > 0 && (
                      <div className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                        {pageRects.length}
                      </div>
                    )}
                  </div>

                  {/* Page info */}
                  <div className="p-2 text-center">
                    <div className={`text-sm font-medium transition-colors duration-200 ${
                      isCurrentPage ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {t('pdf.page', { number: pageNum })}
                    </div>
                    {pageRects.length > 0 && (
                      <div className="text-xs text-red-600 mt-1">
                        {t('pdf.marks', { count: pageRects.length })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
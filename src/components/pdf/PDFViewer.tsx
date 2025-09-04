import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, Maximize2, Move, Grid3X3, List } from 'lucide-react';
import type { RedactionRect } from '../../hooks/usePDFProcessor';
import { PageSelector } from './PageSelector';
import { ThumbnailView } from './ThumbnailView';

interface PDFViewerProps {
  file: File | null;
  onRenderPage: (pageNum: number, scale?: number) => Promise<any>;
  redactionRects: RedactionRect[][];
  onAddRedactionRect: (pageNum: number, rect: RedactionRect) => void;
  onRemoveRedactionRect: (pageNum: number, rectId: string) => void;
  setRedactionRects: React.Dispatch<React.SetStateAction<RedactionRect[][]>>; // 新增
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  previewMode?: boolean; // 新增预览模式prop
}

// 节流函数
const throttle = <T extends (...args: any[]) => any>(func: T, delay: number): T => {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  return ((...args: any[]) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  }) as T;
};

// 防抖函数
const debounce = <T extends (...args: any[]) => any>(func: T, delay: number): T => {
  let timeoutId: NodeJS.Timeout | null = null;
  return ((...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
};

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
  previewMode = false
}) => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null); // 新增：标记层Canvas
  const containerRef = useRef<HTMLDivElement>(null);
  const baseImageDataRef = useRef<ImageData | null>(null); // 缓存原始PDF图像
  
  const [scale, setScale] = useState(1.2);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentRect, setCurrentRect] = useState<RedactionRect | null>(null);
  const [isPanMode, setIsPanMode] = useState(false);
  const [selectedRectId, setSelectedRectId] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPoint, setDragStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [dragStartRect, setDragStartRect] = useState<RedactionRect | null>(null);
  const [viewMode, setViewMode] = useState<'single' | 'thumbnail'>('single'); // 新增视图模式状态

  // 使用useMemo缓存当前页面的标记矩形
  const pageRects = useMemo(() => {
    return redactionRects[currentPage - 1] || [];
  }, [redactionRects, currentPage]);

  // 优化的标记绘制函数 - 精确处理设备像素比
  const drawRedactionRects = useCallback((includeTemp = false, tempRect?: RedactionRect) => {
    const overlayCanvas = overlayCanvasRef.current;
    const mainCanvas = canvasRef.current;
    if (!overlayCanvas || !mainCanvas) return;

    const ctx = overlayCanvas.getContext('2d', {
      alpha: true,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high'
    }) as CanvasRenderingContext2D;
    if (!ctx) return;

    // 清除overlay canvas
    ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    
    ctx.save();
    
    // 考虑设备像素比的缩放
    const devicePixelRatio = window.devicePixelRatio || 1;
    const displayWidth = overlayCanvas.width / devicePixelRatio;
    const displayHeight = overlayCanvas.height / devicePixelRatio;
    
    ctx.scale(devicePixelRatio, devicePixelRatio);

    // 绘制已确认的标记区域
    pageRects.forEach((rect, index) => {
      const x = (rect.x / rect.pageWidth) * displayWidth;
      const y = (rect.y / rect.pageHeight) * displayHeight;
      const width = (rect.width / rect.pageWidth) * displayWidth;
      const height = (rect.height / rect.pageHeight) * displayHeight;

      if (previewMode) {
        // 预览模式：显示实际的涂黑效果
        ctx.fillStyle = '#000000';
        ctx.fillRect(x, y, width, height);
      } else {
        // 编辑模式：显示半透明标记和边框
        const isSelected = selectedRectId === rect.id;
        
        // 使用自定义颜色或默认颜色
        const color = rect.color || 'red';
        const colorMap = {
          red: { fill: 'rgba(239, 68, 68, 0.2)', stroke: '#DC2626', selected: { fill: 'rgba(239, 68, 68, 0.35)', stroke: '#B91C1C' } },
          blue: { fill: 'rgba(59, 130, 246, 0.2)', stroke: '#3B82F6', selected: { fill: 'rgba(59, 130, 246, 0.35)', stroke: '#2563EB' } },
          green: { fill: 'rgba(34, 197, 94, 0.2)', stroke: '#22C55E', selected: { fill: 'rgba(34, 197, 94, 0.35)', stroke: '#16A34A' } },
          yellow: { fill: 'rgba(234, 179, 8, 0.2)', stroke: '#EAB308', selected: { fill: 'rgba(234, 179, 8, 0.35)', stroke: '#CA8A04' } },
          purple: { fill: 'rgba(168, 85, 247, 0.2)', stroke: '#A855F7', selected: { fill: 'rgba(168, 85, 247, 0.35)', stroke: '#9333EA' } }
        };
        
        const currentColor = colorMap[color as keyof typeof colorMap] || colorMap.red;
        
        // 根据选中状态设置样式
        if (isSelected) {
          ctx.fillStyle = currentColor.selected.fill;
          ctx.strokeStyle = currentColor.selected.stroke;
          ctx.lineWidth = 3 / devicePixelRatio; // 调整线宽适应像素比
          ctx.setLineDash([]);
        } else {
          ctx.fillStyle = currentColor.fill;
          ctx.strokeStyle = currentColor.stroke;
          ctx.lineWidth = 2 / devicePixelRatio;
          ctx.setLineDash([4 / devicePixelRatio, 4 / devicePixelRatio]);
        }

        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
        
        // 添加序号标记
        ctx.setLineDash([]);
        ctx.fillStyle = isSelected ? currentColor.selected.stroke : currentColor.stroke;
        ctx.font = `${12 / devicePixelRatio}px system-ui, -apple-system, sans-serif`;
        ctx.fillText(`${index + 1}`, x + 4 / devicePixelRatio, y + 16 / devicePixelRatio);
        
        // 如果选中，绘制调整手柄
        if (isSelected) {
          const handleSize = 8 / devicePixelRatio;
          ctx.fillStyle = currentColor.selected.stroke;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2 / devicePixelRatio;
          
          // 四个角的手柄
          const handles = [
            { x: x - handleSize/2, y: y - handleSize/2 }, // 左上
            { x: x + width - handleSize/2, y: y - handleSize/2 }, // 右上
            { x: x - handleSize/2, y: y + height - handleSize/2 }, // 左下
            { x: x + width - handleSize/2, y: y + height - handleSize/2 }, // 右下
          ];
          
          handles.forEach(handle => {
            ctx.fillRect(handle.x, handle.y, handleSize, handleSize);
            ctx.strokeRect(handle.x, handle.y, handleSize, handleSize);
          });
        }
      }
    });

    // 绘制临时矩形（仅编辑模式）
    if (!previewMode && includeTemp && tempRect) {
      const x = tempRect.x;
      const y = tempRect.y;
      const width = tempRect.width;
      const height = tempRect.height;
      
      ctx.setLineDash([2 / devicePixelRatio, 2 / devicePixelRatio]);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 2 / devicePixelRatio;
      ctx.fillRect(x, y, width, height);
      ctx.strokeRect(x, y, width, height);
    }

    ctx.restore();
  }, [pageRects, selectedRectId, previewMode]);

  // 优化PDF页面渲染 - 精确缩放和定位
  const renderCurrentPage = useCallback(async () => {
    if (!canvasRef.current || !overlayCanvasRef.current || !file) return;

    try {
      const result = await onRenderPage(currentPage, scale);
      if (result.success && result.imageData) {
        const mainCanvas = canvasRef.current;
        const overlayCanvas = overlayCanvasRef.current;
        const ctx = mainCanvas.getContext('2d', {
          alpha: false,
          imageSmoothingEnabled: true,
          imageSmoothingQuality: 'high',
          willReadFrequently: false // 优化性能
        }) as CanvasRenderingContext2D;
        if (!ctx) return;
        
        // 精确设置canvas尺寸，确保像素完美渲染
        const devicePixelRatio = window.devicePixelRatio || 1;
        const displayWidth = result.width;
        const displayHeight = result.height;
        
        // 设置实际渲染尺寸（考虑设备像素比）
        mainCanvas.width = displayWidth * devicePixelRatio;
        mainCanvas.height = displayHeight * devicePixelRatio;
        overlayCanvas.width = displayWidth * devicePixelRatio;
        overlayCanvas.height = displayHeight * devicePixelRatio;
        
        // 设置CSS显示尺寸
        mainCanvas.style.width = `${displayWidth}px`;
        mainCanvas.style.height = `${displayHeight}px`;
        overlayCanvas.style.width = `${displayWidth}px`;
        overlayCanvas.style.height = `${displayHeight}px`;
        
        // 缩放上下文以适应设备像素比
        ctx.scale(devicePixelRatio, devicePixelRatio);
        
        // 创建缩放后的ImageData
        if (devicePixelRatio !== 1) {
          const scaledCanvas = document.createElement('canvas');
          scaledCanvas.width = displayWidth;
          scaledCanvas.height = displayHeight;
          const scaledCtx = scaledCanvas.getContext('2d', {
            alpha: false,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high'
          }) as CanvasRenderingContext2D;
          
          scaledCtx.putImageData(result.imageData, 0, 0);
          ctx.drawImage(scaledCanvas, 0, 0);
        } else {
          ctx.putImageData(result.imageData, 0, 0);
        }
        
        // 缓存原始图像数据
        baseImageDataRef.current = result.imageData;

        // 使用requestAnimationFrame优化标记绘制
        requestAnimationFrame(() => {
          drawRedactionRects();
        });
      }
    } catch (error) {
      console.error(t('pdf.renderError'), error);
    }
  }, [file, currentPage, scale, onRenderPage, drawRedactionRects]);

  // 当页面或缩放改变时重新渲染，包括视图模式变化
  useEffect(() => {
    if (file && currentPage > 0) {
      renderCurrentPage();
    }
  }, [file, currentPage, renderCurrentPage]);

  // 当从缩略图切换回单页视图时，确保重新渲染
  useEffect(() => {
    if (viewMode === 'single' && file && currentPage > 0) {
      console.log(`视图模式切换到单页视图，当前页面: ${currentPage}`);
      // 延迟一下确保DOM更新完成
      const timeoutId = setTimeout(() => {
        console.log(`开始重新渲染页面 ${currentPage}`);
        // 重置Canvas尺寸并重新渲染
        if (canvasRef.current && overlayCanvasRef.current) {
          // 清除之前的内容
          const ctx = canvasRef.current.getContext('2d');
          const overlayCtx = overlayCanvasRef.current.getContext('2d') as CanvasRenderingContext2D;
          
          if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }
          if (overlayCtx) {
            overlayCtx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
          }
        }
        
        renderCurrentPage();
      }, 150); // 稍微增加延迟确保DOM完全更新
      
      return () => clearTimeout(timeoutId);
    }
  }, [viewMode, file, currentPage, renderCurrentPage]);

  // 优化标记区域重绘 - 使用防抖和requestAnimationFrame
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(() => {
        drawRedactionRects();
      });
    }, 16); // ~60fps
    return () => clearTimeout(timeoutId);
  }, [drawRedactionRects]);

  // 检查是否点击在调整手柄上
  const getResizeHandle = useCallback((coords: { x: number; y: number }, rect: RedactionRect, canvas: HTMLCanvasElement): string | null => {
    const x = (rect.x / rect.pageWidth) * canvas.width;
    const y = (rect.y / rect.pageHeight) * canvas.height;
    const width = (rect.width / rect.pageWidth) * canvas.width;
    const height = (rect.height / rect.pageHeight) * canvas.height;
    const handleSize = 8;
    const tolerance = handleSize;

    // 检查四个角的手柄
    const handles = [
      { id: 'nw', x: x - handleSize/2, y: y - handleSize/2 }, // 左上
      { id: 'ne', x: x + width - handleSize/2, y: y - handleSize/2 }, // 右上
      { id: 'sw', x: x - handleSize/2, y: y + height - handleSize/2 }, // 左下
      { id: 'se', x: x + width - handleSize/2, y: y + height - handleSize/2 }, // 右下
    ];

    for (const handle of handles) {
      if (coords.x >= handle.x - tolerance/2 && coords.x <= handle.x + handleSize + tolerance/2 &&
          coords.y >= handle.y - tolerance/2 && coords.y <= handle.y + handleSize + tolerance/2) {
        return handle.id;
      }
    }

    return null;
  }, []);

  // 检查是否点击在矩形内部（用于拖动）
  const isPointInRect = useCallback((coords: { x: number; y: number }, rect: RedactionRect, canvas: HTMLCanvasElement): boolean => {
    const x = (rect.x / rect.pageWidth) * canvas.width;
    const y = (rect.y / rect.pageHeight) * canvas.height;
    const width = (rect.width / rect.pageWidth) * canvas.width;
    const height = (rect.height / rect.pageHeight) * canvas.height;

    return coords.x >= x && coords.x <= x + width && 
           coords.y >= y && coords.y <= y + height;
  }, []);

  // 优化坐标获取，确保精确的位置计算
  const getCanvasCoordinates = useCallback((e: React.MouseEvent) => {
    if (!overlayCanvasRef.current) return null;

    const canvas = overlayCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // 考虑设备像素比和缩放
    const devicePixelRatio = window.devicePixelRatio || 1;
    const scaleX = (canvas.width / devicePixelRatio) / rect.width;
    const scaleY = (canvas.height / devicePixelRatio) / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }, []);

  // 处理双击删除
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if (isPanMode || !overlayCanvasRef.current || previewMode) return;

    const coords = getCanvasCoordinates(e);
    if (!coords) return;

    const canvas = overlayCanvasRef.current;
    
    // 检查是否双击了现有的标记区域
    for (const rect of pageRects) {
      if (isPointInRect(coords, rect, canvas)) {
        onRemoveRedactionRect(currentPage, rect.id);
        setSelectedRectId(null);
        break;
      }
    }
  }, [isPanMode, getCanvasCoordinates, pageRects, isPointInRect, onRemoveRedactionRect, currentPage, previewMode]);

  // 鼠标事件处理
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isPanMode || !overlayCanvasRef.current || previewMode) return;

    const coords = getCanvasCoordinates(e);
    if (!coords) return;

    const canvas = overlayCanvasRef.current;
    
    // 检查是否点击了现有的标记区域
    let clickedRect: RedactionRect | null = null;
    for (const rect of pageRects) {
      if (isPointInRect(coords, rect, canvas)) {
        clickedRect = rect;
        break;
      }
    }
    
    if (clickedRect) {
      // 选中该区域
      setSelectedRectId(clickedRect.id);
      
      // 检查是否点击了调整手柄
      const handleId = getResizeHandle(coords, clickedRect, canvas);
      if (handleId) {
        setIsResizing(true);
        setResizeHandle(handleId);
        setDragStartPoint(coords);
        setDragStartRect({ ...clickedRect });
      } else {
        // 点击在矩形内部，准备拖动
        setIsDragging(true);
        setDragStartPoint(coords);
        setDragStartRect({ ...clickedRect });
      }
      return;
    } else {
      // 点击空白区域，取消选择并开始新标记
      setSelectedRectId(null);
    }
    
    // 开始新标记
    setIsDrawing(true);
    setStartPoint(coords);
  }, [isPanMode, getCanvasCoordinates, pageRects, isPointInRect, getResizeHandle, previewMode]);

  // 优化鼠标移动处理 - 使用节流
  const handleMouseMove = useCallback(throttle((e: React.MouseEvent) => {
    if (previewMode || !overlayCanvasRef.current) return;

    const coords = getCanvasCoordinates(e);
    if (!coords) return;

    const canvas = overlayCanvasRef.current;

    // 处理拖动
    if (isDragging && dragStartPoint && dragStartRect && selectedRectId) {
      const deltaX = coords.x - dragStartPoint.x;
      const deltaY = coords.y - dragStartPoint.y;
      
      const newRect: RedactionRect = {
        ...dragStartRect,
        x: Math.max(0, Math.min(canvas.width - dragStartRect.width, dragStartRect.x + deltaX)),
        y: Math.max(0, Math.min(canvas.height - dragStartRect.height, dragStartRect.y + deltaY))
      };

      // 更新矩形位置
      setRedactionRects(prev => {
        const newRects = [...prev];
        const pageIndex = currentPage - 1;
        if (newRects[pageIndex]) {
          const rectIndex = newRects[pageIndex].findIndex(r => r.id === selectedRectId);
          if (rectIndex >= 0) {
            newRects[pageIndex][rectIndex] = newRect;
          }
        }
        return newRects;
      });

      drawRedactionRects();
      return;
    }

    // 处理调整大小
    if (isResizing && dragStartPoint && dragStartRect && selectedRectId && resizeHandle) {
      const deltaX = coords.x - dragStartPoint.x;
      const deltaY = coords.y - dragStartPoint.y;
      
      const newRect = { ...dragStartRect };
      
      switch (resizeHandle) {
        case 'nw': // 左上角
          newRect.x = Math.max(0, dragStartRect.x + deltaX);
          newRect.y = Math.max(0, dragStartRect.y + deltaY);
          newRect.width = Math.max(20, dragStartRect.width - deltaX);
          newRect.height = Math.max(20, dragStartRect.height - deltaY);
          break;
        case 'ne': // 右上角
          newRect.y = Math.max(0, dragStartRect.y + deltaY);
          newRect.width = Math.max(20, dragStartRect.width + deltaX);
          newRect.height = Math.max(20, dragStartRect.height - deltaY);
          break;
        case 'sw': // 左下角
          newRect.x = Math.max(0, dragStartRect.x + deltaX);
          newRect.width = Math.max(20, dragStartRect.width - deltaX);
          newRect.height = Math.max(20, dragStartRect.height + deltaY);
          break;
        case 'se': // 右下角
          newRect.width = Math.max(20, dragStartRect.width + deltaX);
          newRect.height = Math.max(20, dragStartRect.height + deltaY);
          break;
      }

      // 限制在画布边界内
      newRect.x = Math.max(0, Math.min(canvas.width - newRect.width, newRect.x));
      newRect.y = Math.max(0, Math.min(canvas.height - newRect.height, newRect.y));
      newRect.width = Math.min(canvas.width - newRect.x, newRect.width);
      newRect.height = Math.min(canvas.height - newRect.y, newRect.height);

      // 更新矩形大小
      setRedactionRects(prev => {
        const newRects = [...prev];
        const pageIndex = currentPage - 1;
        if (newRects[pageIndex]) {
          const rectIndex = newRects[pageIndex].findIndex(r => r.id === selectedRectId);
          if (rectIndex >= 0) {
            newRects[pageIndex][rectIndex] = newRect;
          }
        }
        return newRects;
      });

      drawRedactionRects();
      return;
    }

    // 处理新建标记
    if (isDrawing && startPoint) {
      const width = Math.abs(coords.x - startPoint.x);
      const height = Math.abs(coords.y - startPoint.y);
      const x = Math.min(startPoint.x, coords.x);
      const y = Math.min(startPoint.y, coords.y);
      
      const tempRect: RedactionRect = {
        x, y, width, height,
        pageWidth: canvas.width, 
        pageHeight: canvas.height,
        id: `temp-${Date.now()}`
      };
      
      setCurrentRect(tempRect);
      
      // 重绘标记层（包括临时矩形）
      drawRedactionRects(true, tempRect);
    }
  }, 16), [isDrawing, isDragging, isResizing, startPoint, dragStartPoint, dragStartRect, selectedRectId, resizeHandle, getCanvasCoordinates, drawRedactionRects, currentPage, setRedactionRects]); // 约60fps

  const handleMouseUp = useCallback(() => {
    // 处理新建标记
    if (isDrawing && currentRect && currentRect.width > 10 && currentRect.height > 10) {
      onAddRedactionRect(currentPage, { ...currentRect, id: `rect-${Date.now()}` });
    }

    // 处理拖动完成
    if (isDragging && selectedRectId) {
      // 保存到历史记录（通过父组件的更新会自动触发）
      // 这里不需要额外操作，因为在mousemove中已经更新了redactionRects
    }

    // 处理调整大小完成
    if (isResizing && selectedRectId) {
      // 保存到历史记录（通过父组件的更新会自动触发）
      // 这里不需要额外操作，因为在mousemove中已经更新了redactionRects
    }

    // 重置所有状态
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentRect(null);
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
    setDragStartPoint(null);
    setDragStartRect(null);
  }, [isDrawing, isDragging, isResizing, currentRect, currentPage, selectedRectId, onAddRedactionRect]);

  // 缩放控制
  const handleZoomIn = useCallback(() => setScale(prev => Math.min(prev * 1.25, 4.0)), []);
  const handleZoomOut = useCallback(() => setScale(prev => Math.max(prev / 1.25, 0.3)), []);
  const handleResetZoom = useCallback(() => setScale(1.2), []);
  
  // 内存管理 - 清理资源
  useEffect(() => {
    return () => {
      // 组件卸载时清理canvas引用和缓存
      if (baseImageDataRef.current) {
        baseImageDataRef.current = null;
      }
      
      // 清理canvas上下文
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
      
      if (overlayCanvasRef.current) {
        const overlayCtx = overlayCanvasRef.current.getContext('2d');
        if (overlayCtx) {
          overlayCtx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
        }
      }
    };
  }, []);

  // 性能优化 - 防止不必要的重新渲染
  const memoizedFitWidth = useCallback(() => {
    if (containerRef.current && overlayCanvasRef.current) {
      const containerWidth = containerRef.current.clientWidth - 32;
      const canvasWidth = overlayCanvasRef.current.width / (window.devicePixelRatio || 1);
      const newScale = (containerWidth / canvasWidth) * 0.95;
      
      // 只有当缩放变化显著时才更新
      if (Math.abs(newScale - scale) > 0.05) {
        setScale(newScale);
      }
    }
  }, [scale]);

  const handleFitWidth = useMemo(() => memoizedFitWidth, [memoizedFitWidth]);

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          onPageChange(Math.max(1, currentPage - 1));
          break;
        case 'ArrowRight':
          e.preventDefault();
          onPageChange(Math.min(totalPages, currentPage + 1));
          break;
        case '=':
        case '+':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
          e.preventDefault();
          handleZoomOut();
          break;
        case '0':
          e.preventDefault();
          handleResetZoom();
          break;
        case 'f':
          e.preventDefault();
          handleFitWidth();
          break;
        case ' ':
          e.preventDefault();
          setIsPanMode(!isPanMode);
          break;
        case 'Delete':
        case 'Backspace':
          if (selectedRectId) {
            e.preventDefault();
            onRemoveRedactionRect(currentPage, selectedRectId);
            setSelectedRectId(null);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setSelectedRectId(null);
          setIsDrawing(false);
          setStartPoint(null);
          setCurrentRect(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, onPageChange, handleZoomIn, handleZoomOut, handleResetZoom, handleFitWidth, isPanMode, selectedRectId, onRemoveRedactionRect]);

  if (!file) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 text-gray-500">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium">{t('pdf.uploadRequired')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* 精简工具栏 */}
      <div className="flex items-center justify-between px-2 sm:px-4 py-2 bg-white border-b border-gray-200/70 shadow-sm">
        <div className="flex items-center space-x-1">
          <button 
            onClick={() => onPageChange(Math.max(1, currentPage - 1))} 
            disabled={currentPage <= 1 || loading} 
            className="p-1.5 sm:p-2 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title={t('pdf.previousPage')}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {/* 页面选择器 */}
          <PageSelector
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
          
          <button 
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} 
            disabled={currentPage >= totalPages || loading} 
            className="p-1.5 sm:p-2 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title={t('pdf.nextPage')}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center space-x-1">
          {/* 视图模式切换 */}
          <button
            onClick={() => {
              const newMode = viewMode === 'single' ? 'thumbnail' : 'single';
              setViewMode(newMode);
              // 如果切换到单页视图，清除任何选中状态
              if (newMode === 'single') {
                setSelectedRectId(null);
                setIsDrawing(false);
                setStartPoint(null);
                setCurrentRect(null);
              }
            }}
            className={`p-1.5 sm:p-2 rounded-md transition-colors ${
              viewMode === 'thumbnail' 
                ? 'bg-blue-100 text-blue-600' 
                : 'hover:bg-gray-100'
            }`}
            title={viewMode === 'single' ? t('pdf.thumbnailView') : t('pdf.singleView')}
          >
            {viewMode === 'single' ? <Grid3X3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
          </button>
          
          {viewMode === 'single' && (
            <>
              <button 
                onClick={handleZoomOut} 
                className="p-1.5 sm:p-2 rounded-md hover:bg-gray-100 transition-colors"
                title={t('pdf.zoomOut')}
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <div className="px-1.5 sm:px-2 py-1 text-xs sm:text-sm font-medium bg-gray-50 rounded-md min-w-[45px] sm:min-w-[60px] text-center">
                {Math.round(scale * 100)}%
              </div>
              <button 
                onClick={handleZoomIn} 
                className="p-1.5 sm:p-2 rounded-md hover:bg-gray-100 transition-colors"
                title={t('pdf.zoomIn')}
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button 
                onClick={handleResetZoom} 
                className="hidden sm:block p-2 rounded-md hover:bg-gray-100 transition-colors"
                title={t('pdf.resetZoom')}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button 
                onClick={handleFitWidth} 
                className="hidden sm:block p-2 rounded-md hover:bg-gray-100 transition-colors"
                title={t('pdf.fitToWidth')}
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsPanMode(!isPanMode)}
                className={`hidden sm:block p-2 rounded-md transition-colors ${isPanMode ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                title={t('pdf.togglePanMode')}
              >
                <Move className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* PDF渲染区域 */}
      <div ref={containerRef} className="flex-1 overflow-auto p-2 sm:p-4 pb-16 lg:pb-4">
        {viewMode === 'single' ? (
          <div className="flex justify-center">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-full relative">
              {loading && !canvasRef.current ? (
                <div className="flex items-center justify-center w-full h-64 sm:h-96 bg-gray-50">
                  <div className="text-center">
                    <div className="animate-spin w-6 sm:w-8 h-6 sm:h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600 text-xs sm:text-sm">{t('pdf.rendering')}</p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {/* 主Canvas - PDF内容 */}
                  <canvas
                    ref={canvasRef}
                    className="block max-w-full h-auto"
                  />
                  {/* 覆盖Canvas - 标记层 */}
                  <canvas
                    ref={overlayCanvasRef}
                    className={`absolute top-0 left-0 max-w-full h-auto ${
                      isPanMode ? 'cursor-grab active:cursor-grabbing' : 'cursor-crosshair'
                    }`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onDoubleClick={handleDoubleClick}
                    onTouchStart={(e) => {
                      const touch = e.touches[0];
                      const mouseEvent = new MouseEvent('mousedown', {
                        clientX: touch.clientX,
                        clientY: touch.clientY
                      });
                      handleMouseDown(mouseEvent as any);
                    }}
                    onTouchMove={(e) => {
                      e.preventDefault();
                      const touch = e.touches[0];
                      const mouseEvent = new MouseEvent('mousemove', {
                        clientX: touch.clientX,
                        clientY: touch.clientY
                      });
                      handleMouseMove(mouseEvent as any);
                    }}
                    onTouchEnd={() => handleMouseUp()}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <ThumbnailView
            file={file}
            onRenderPage={onRenderPage}
            redactionRects={redactionRects}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(pageNum) => {
              console.log(`从缩略图跳转到页面 ${pageNum}，切换回单页视图`);
              onPageChange(pageNum);
              // 点击缩略图后切换回单页视图
              setViewMode('single');
            }}
            loading={loading}
            previewMode={previewMode}
          />
        )}
      </div>

      {/* 状态栏 - 桌面端显示 */}
      <div className="hidden lg:block px-4 py-2 bg-white border-t border-gray-200/70 text-xs text-gray-500">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span>{t('pdf.markAreasCount', { count: pageRects.length })}</span>
            {previewMode && <span className="text-orange-600 font-medium bg-orange-100 px-2 py-1 rounded">{t('pdf.previewMode')}</span>}
            {!previewMode && selectedRectId && <span className="text-blue-600 font-medium">{t('pdf.rectSelected')}</span>}
            {!previewMode && isPanMode && <span className="text-blue-600 font-medium">{t('pdf.panMode')}</span>}
          </div>
          <div className="text-right">
            <div>
              {previewMode 
                ? t('pdf.previewDescription')
                : selectedRectId 
                ? t('pdf.editInstructions') 
                : isPanMode 
                ? t('pdf.panModeInstructions') 
                : t('pdf.dragInstructions')
              }
            </div>
            {!previewMode && (
              <div className="text-gray-400">
                {t('pdf.shortcuts')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
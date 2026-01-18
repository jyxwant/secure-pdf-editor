import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import type { RedactionRect } from '../../hooks/usePDFProcessor';
import { useTranslation } from 'react-i18next';

interface PDFPageProps {
  pageNumber: number;
  scale: number;
  onRenderPage: (pageNum: number, scale?: number) => Promise<any>;
  rects: RedactionRect[];
  onAddRect: (rect: RedactionRect) => void;
  onUpdateRect: (rect: RedactionRect) => void;
  onRemoveRect: (rectId: string) => void;
  selectedRectId: string | null;
  onSelectRect: (rectId: string | null) => void;
  previewMode: boolean;
  isPanMode: boolean;
  redactionMethod?: 'canvas' | 'pixelate';
}

export const PDFPage: React.FC<PDFPageProps> = ({
  pageNumber,
  scale,
  onRenderPage,
  rects,
  onAddRect,
  onUpdateRect,
  onRemoveRect,
  selectedRectId,
  onSelectRect,
  previewMode,
  isPanMode,
  redactionMethod = 'canvas'
}) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  
  // Interaction states
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  
  // Refs for interaction to avoid re-renders
  const tempRectRef = useRef<RedactionRect | null>(null);
  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);
  const dragStartPointRef = useRef<{ x: number; y: number } | null>(null);
  const dragStartRectRef = useRef<RedactionRect | null>(null);

  // Intersection Observer to detect visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { rootMargin: '200px' } // Preload when 200px away
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const drawRedactionRects = useCallback(() => {
    const overlayCanvas = overlayRef.current;
    const mainCanvas = canvasRef.current;
    if (!overlayCanvas) return;

    const ctx = overlayCanvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    ctx.save();
    
    const devicePixelRatio = window.devicePixelRatio || 1;
    const displayWidth = overlayCanvas.width / devicePixelRatio;
    const displayHeight = overlayCanvas.height / devicePixelRatio;
    
    ctx.scale(devicePixelRatio, devicePixelRatio);

    rects.forEach((rect, index) => {
      const isBeingModified = (isDraggingRef.current || isResizingRef.current) && selectedRectId === rect.id;
      const rectToDraw = isBeingModified && tempRectRef.current ? tempRectRef.current : rect;

      const x = (rectToDraw.x / rectToDraw.pageWidth) * displayWidth;
      const y = (rectToDraw.y / rectToDraw.pageHeight) * displayHeight;
      const width = (rectToDraw.width / rectToDraw.pageWidth) * displayWidth;
      const height = (rectToDraw.height / rectToDraw.pageHeight) * displayHeight;

      if (previewMode) {
        if (redactionMethod === 'pixelate' && mainCanvas) {
          try {
            const physicalX = Math.floor(x * devicePixelRatio);
            const physicalY = Math.floor(y * devicePixelRatio);
            const physicalWidth = Math.ceil(width * devicePixelRatio);
            const physicalHeight = Math.ceil(height * devicePixelRatio);

            const mainCtx = mainCanvas.getContext('2d');
            if (mainCtx) {
              const imageData = mainCtx.getImageData(physicalX, physicalY, physicalWidth, physicalHeight);
              const pixelSize = 8 * devicePixelRatio;

              for (let py = 0; py < physicalHeight; py += pixelSize) {
                for (let px = 0; px < physicalWidth; px += pixelSize) {
                  let r = 0, g = 0, b = 0, count = 0;

                  for (let dy = 0; dy < pixelSize && py + dy < physicalHeight; dy++) {
                    for (let dx = 0; dx < pixelSize && px + dx < physicalWidth; dx++) {
                      const idx = ((py + dy) * physicalWidth + (px + dx)) * 4;
                      if (idx + 2 < imageData.data.length) {
                        r += imageData.data[idx];
                        g += imageData.data[idx + 1];
                        b += imageData.data[idx + 2];
                        count++;
                      }
                    }
                  }

                  if (count > 0) {
                    r = Math.floor(r / count);
                    g = Math.floor(g / count);
                    b = Math.floor(b / count);

                    const fillW = Math.min(pixelSize, physicalWidth - px);
                    const fillH = Math.min(pixelSize, physicalHeight - py);
                    
                    for (let dy = 0; dy < fillH; dy++) {
                      for (let dx = 0; dx < fillW; dx++) {
                        const idx = ((py + dy) * physicalWidth + (px + dx)) * 4;
                        imageData.data[idx] = r;
                        imageData.data[idx + 1] = g;
                        imageData.data[idx + 2] = b;
                        imageData.data[idx + 3] = 255;
                      }
                    }
                  }
                }
              }
              ctx.putImageData(imageData, physicalX, physicalY);
            } else {
              throw new Error('No main context');
            }
          } catch (e) {
            console.warn('Pixelate preview failed, falling back to black', e);
            ctx.fillStyle = '#000000';
            ctx.fillRect(x, y, width, height);
          }
        } else {
          ctx.fillStyle = '#000000';
          ctx.fillRect(x, y, width, height);
        }
      } else {
        const isSelected = selectedRectId === rect.id;
        const color = rectToDraw.color || 'red';
        const colorMap: Record<string, any> = {
          red: { fill: 'rgba(239, 68, 68, 0.2)', stroke: '#DC2626' },
          blue: { fill: 'rgba(59, 130, 246, 0.2)', stroke: '#3B82F6' },
          green: { fill: 'rgba(34, 197, 94, 0.2)', stroke: '#22C55E' },
          yellow: { fill: 'rgba(234, 179, 8, 0.2)', stroke: '#EAB308' },
          purple: { fill: 'rgba(168, 85, 247, 0.2)', stroke: '#A855F7' }
        };
        const style = colorMap[color] || colorMap.red;

        ctx.fillStyle = isSelected ? style.fill.replace('0.2', '0.35') : style.fill;
        ctx.strokeStyle = style.stroke;
        ctx.lineWidth = isSelected ? 3 / devicePixelRatio : 2 / devicePixelRatio;
        ctx.setLineDash(isSelected ? [] : [4 / devicePixelRatio, 4 / devicePixelRatio]);

        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
        
        ctx.setLineDash([]);
        ctx.fillStyle = style.stroke;
        ctx.font = `${12 / devicePixelRatio}px sans-serif`;
        ctx.fillText(`${index + 1}`, x + 4 / devicePixelRatio, y + 16 / devicePixelRatio);
        
        if (isSelected) {
          const handleSize = 8 / devicePixelRatio;
          ctx.fillStyle = style.stroke;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2 / devicePixelRatio;
          const handles = [
            { x: x - handleSize/2, y: y - handleSize/2 },
            { x: x + width - handleSize/2, y: y - handleSize/2 },
            { x: x - handleSize/2, y: y + height - handleSize/2 },
            { x: x + width - handleSize/2, y: y + height - handleSize/2 },
          ];
          handles.forEach(handle => {
            ctx.fillRect(handle.x, handle.y, handleSize, handleSize);
            ctx.strokeRect(handle.x, handle.y, handleSize, handleSize);
          });
        }
      }
    });

    if (isDrawing && tempRectRef.current) {
      const rect = tempRectRef.current;
      const x = rect.x;
      const y = rect.y;
      ctx.setLineDash([2 / devicePixelRatio, 2 / devicePixelRatio]);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 2 / devicePixelRatio;
      ctx.fillRect(x, y, rect.width, rect.height);
      ctx.strokeRect(x, y, rect.width, rect.height);
    }
    ctx.restore();
  }, [rects, selectedRectId, previewMode, isDrawing, redactionMethod]);

  useEffect(() => {
    if (isVisible) {
      const render = async () => {
        try {
          setRenderError(null);
          const result = await onRenderPage(pageNumber, scale);
          if (result.success && result.imageData) {
            const mainCanvas = canvasRef.current;
            const overlayCanvas = overlayRef.current;
            if (!mainCanvas || !overlayCanvas) return;

            const ctx = mainCanvas.getContext('2d', { alpha: false, desynchronized: true });
            if (!ctx) return;

            const devicePixelRatio = window.devicePixelRatio || 1;
            const targetWidth = result.width * devicePixelRatio;
            const targetHeight = result.height * devicePixelRatio;

            if (mainCanvas.width !== targetWidth || mainCanvas.height !== targetHeight) {
              mainCanvas.width = targetWidth;
              mainCanvas.height = targetHeight;
              overlayCanvas.width = targetWidth;
              overlayCanvas.height = targetHeight;
              
              mainCanvas.style.width = `${result.width}px`;
              mainCanvas.style.height = `${result.height}px`;
              overlayCanvas.style.width = `${result.width}px`;
              overlayCanvas.style.height = `${result.height}px`;

              setDimensions({ width: result.width, height: result.height });
            }

            ctx.scale(devicePixelRatio, devicePixelRatio);
            if (devicePixelRatio !== 1) {
              const tempCanvas = document.createElement('canvas');
              tempCanvas.width = result.width;
              tempCanvas.height = result.height;
              tempCanvas.getContext('2d')?.putImageData(result.imageData, 0, 0);
              ctx.drawImage(tempCanvas, 0, 0);
            } else {
              ctx.putImageData(result.imageData, 0, 0);
            }
            
            requestAnimationFrame(drawRedactionRects);
          } else {
            setRenderError(result.error || 'Failed to render page');
          }
        } catch (error: any) {
          console.error(`Error rendering page ${pageNumber}:`, error);
          setRenderError(error.message || 'Unknown error');
        }
      };
      render();
    }
  }, [isVisible, pageNumber, scale, onRenderPage, drawRedactionRects]);

  // Interaction Handlers
  const getCanvasCoordinates = useCallback((e: React.MouseEvent) => {
    if (!overlayRef.current) return null;
    const rect = overlayRef.current.getBoundingClientRect();
    const devicePixelRatio = window.devicePixelRatio || 1;
    const scaleX = (overlayRef.current.width / devicePixelRatio) / rect.width;
    const scaleY = (overlayRef.current.height / devicePixelRatio) / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }, []);

  const getResizeHandle = useCallback((coords: {x:number, y:number}, rect: RedactionRect, canvas: HTMLCanvasElement) => {
    const scaleX = canvas.width / rect.pageWidth;
    const scaleY = canvas.height / rect.pageHeight;
    const x = rect.x * scaleX;
    const y = rect.y * scaleY;
    const w = rect.width * scaleX;
    const h = rect.height * scaleY;
    const handleSize = 10;
    
    if (Math.abs(coords.x - x) < handleSize && Math.abs(coords.y - y) < handleSize) return 'nw';
    if (Math.abs(coords.x - (x+w)) < handleSize && Math.abs(coords.y - y) < handleSize) return 'ne';
    if (Math.abs(coords.x - x) < handleSize && Math.abs(coords.y - (y+h)) < handleSize) return 'sw';
    if (Math.abs(coords.x - (x+w)) < handleSize && Math.abs(coords.y - (y+h)) < handleSize) return 'se';
    return null;
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isPanMode || previewMode || !overlayRef.current) return;
    const coords = getCanvasCoordinates(e);
    if (!coords) return;
    const canvas = overlayRef.current;
    
    // Check if clicking on existing rect
    for (let i = rects.length - 1; i >= 0; i--) {
      const rect = rects[i];
      const scaleX = canvas.width / rect.pageWidth;
      const scaleY = canvas.height / rect.pageHeight;
      const x = rect.x * scaleX;
      const y = rect.y * scaleY;
      const w = rect.width * scaleX;
      const h = rect.height * scaleY;

      if (selectedRectId === rect.id) {
        const handle = getResizeHandle(coords, rect, canvas);
        if (handle) {
          isResizingRef.current = true;
          setResizeHandle(handle);
          dragStartPointRef.current = coords;
          dragStartRectRef.current = { ...rect };
          e.stopPropagation();
          return;
        }
      }

      if (coords.x >= x && coords.x <= x + w && coords.y >= y && coords.y <= y + h) {
        onSelectRect(rect.id);
        isDraggingRef.current = true;
        dragStartPointRef.current = coords;
        dragStartRectRef.current = { ...rect };
        drawRedactionRects();
        e.stopPropagation();
        return;
      }
    }

    onSelectRect(null);
    setIsDrawing(true);
    setStartPoint(coords);
    tempRectRef.current = {
      x: coords.x, y: coords.y, width: 0, height: 0,
      pageWidth: canvas.width, pageHeight: canvas.height, id: 'temp'
    };
  }, [isPanMode, previewMode, getCanvasCoordinates, rects, selectedRectId, getResizeHandle, onSelectRect, drawRedactionRects]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (previewMode || !overlayRef.current) return;
    const coords = getCanvasCoordinates(e);
    if (!coords) return;
    const canvas = overlayRef.current;

    if (isDraggingRef.current && dragStartPointRef.current && dragStartRectRef.current) {
      const deltaX = coords.x - dragStartPointRef.current.x;
      const deltaY = coords.y - dragStartPointRef.current.y;
      const scaleX = dragStartRectRef.current.pageWidth / canvas.width;
      const scaleY = dragStartRectRef.current.pageHeight / canvas.height;
      
      tempRectRef.current = {
        ...dragStartRectRef.current,
        x: dragStartRectRef.current.x + (deltaX * scaleX),
        y: dragStartRectRef.current.y + (deltaY * scaleY)
      };
      requestAnimationFrame(drawRedactionRects);
      return;
    }

    if (isResizingRef.current && dragStartPointRef.current && dragStartRectRef.current && resizeHandle) {
      const deltaX = (coords.x - dragStartPointRef.current.x) * (dragStartRectRef.current.pageWidth / canvas.width);
      const deltaY = (coords.y - dragStartPointRef.current.y) * (dragStartRectRef.current.pageHeight / canvas.height);
      const rect = { ...dragStartRectRef.current };
      
      if (resizeHandle.includes('e')) rect.width += deltaX;
      if (resizeHandle.includes('w')) { rect.x += deltaX; rect.width -= deltaX; }
      if (resizeHandle.includes('s')) rect.height += deltaY;
      if (resizeHandle.includes('n')) { rect.y += deltaY; rect.height -= deltaY; }
      
      if (rect.width < 0) { rect.x += rect.width; rect.width = Math.abs(rect.width); }
      if (rect.height < 0) { rect.y += rect.height; rect.height = Math.abs(rect.height); }
      
      tempRectRef.current = rect;
      requestAnimationFrame(drawRedactionRects);
      return;
    }

    if (isDrawing && startPoint) {
      const width = coords.x - startPoint.x;
      const height = coords.y - startPoint.y;
      tempRectRef.current = {
        x: width < 0 ? coords.x : startPoint.x,
        y: height < 0 ? coords.y : startPoint.y,
        width: Math.abs(width), height: Math.abs(height),
        pageWidth: canvas.width, pageHeight: canvas.height, id: 'temp'
      };
      requestAnimationFrame(drawRedactionRects);
    }
  }, [previewMode, getCanvasCoordinates, isDrawing, startPoint, resizeHandle, drawRedactionRects]);

  const handleMouseUp = useCallback(() => {
    if (isDrawing && tempRectRef.current && tempRectRef.current.width > 5 && tempRectRef.current.height > 5) {
      onAddRect({ ...tempRectRef.current, id: `rect-${Date.now()}` });
    } else if ((isDraggingRef.current || isResizingRef.current) && tempRectRef.current) {
      onUpdateRect(tempRectRef.current);
    }

    setIsDrawing(false);
    isDraggingRef.current = false;
    isResizingRef.current = false;
    setStartPoint(null);
    tempRectRef.current = null;
    dragStartPointRef.current = null;
    dragStartRectRef.current = null;
    setResizeHandle(null);
    requestAnimationFrame(drawRedactionRects);
  }, [isDrawing, onAddRect, onUpdateRect, drawRedactionRects]);

  // Redraw rects when they change externally
  useEffect(() => {
    drawRedactionRects();
  }, [rects, selectedRectId, drawRedactionRects]);

  return (
    <div 
      ref={containerRef}
      className="relative shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] border border-gray-200 bg-white mb-8" 
      style={{ 
        width: dimensions ? dimensions.width : 'auto', 
        height: dimensions ? dimensions.height : '500px', // Min height for placeholder
        minHeight: '200px'
      }}
    >
      <div className="absolute top-0 left-0 bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-br z-10">
        {t('pdf.page', { number: pageNumber })}
      </div>
      
      {!isVisible && (
         <div className="flex items-center justify-center w-full h-full text-gray-400">
           Loading Page {pageNumber}...
         </div>
      )}

      <canvas ref={canvasRef} className="block" />
      <canvas 
        ref={overlayRef}
        className={`absolute top-0 left-0 ${isPanMode ? 'cursor-grab active:cursor-grabbing' : 'cursor-crosshair'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={(e) => {
             // Handle double click to remove
             if (previewMode || !overlayRef.current) return;
             const coords = getCanvasCoordinates(e);
             if (!coords) return;
             const canvas = overlayRef.current;
             for (const rect of rects) {
                 const scaleX = canvas.width / rect.pageWidth;
                 const scaleY = canvas.height / rect.pageHeight;
                 const x = rect.x * scaleX;
                 const y = rect.y * scaleY;
                 const w = rect.width * scaleX;
                 const h = rect.height * scaleY;
                 if (coords.x >= x && coords.x <= x + w && coords.y >= y && coords.y <= y + h) {
                     onRemoveRect(rect.id);
                     onSelectRect(null);
                     return;
                 }
             }
        }}
      />
    </div>
  );
};

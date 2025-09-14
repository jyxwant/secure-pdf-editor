import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface RedactionRect {
  x: number;
  y: number;
  width: number;
  height: number;
  pageWidth: number;
  pageHeight: number;
  id: string;
  color?: string; // 新增颜色属性
}

export interface ProcessingResult {
  success: boolean;
  pdfBytes?: Uint8Array;
  error?: string;
  message?: string;
}

export interface ProcessingProgress {
  stage: 'loading' | 'processing' | 'rendering' | 'finalizing';
  progress: number;
  message: string;
  currentPage?: number;
  totalPages?: number;
}

export interface RenderCache {
  [key: string]: {
    canvas: HTMLCanvasElement;
    imageData: ImageData;
    timestamp: number;
  };
}

export function usePDFProcessor() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<ProcessingProgress | null>(null);
  const pdfDocRef = useRef<any>(null);
  const fileDataRef = useRef<ArrayBuffer | null>(null);
  const renderCacheRef = useRef<RenderCache>({});
  const renderPromiseRef = useRef<Promise<any> | null>(null);
  // Lazy-loaded libraries
  const pdfjsLibRef = useRef<any>(null);
  const pdfLibRef = useRef<any>(null);

  const ensurePDFJS = useCallback(async () => {
    if (!pdfjsLibRef.current) {
      const lib = await import('pdfjs-dist');
      const workerModule: any = await import('pdfjs-dist/build/pdf.worker.mjs?url');
      const workerUrl = workerModule?.default || workerModule;
      (lib as any).GlobalWorkerOptions.workerSrc = workerUrl;
      pdfjsLibRef.current = lib;
    }
    return pdfjsLibRef.current as typeof import('pdfjs-dist');
  }, []);

  const ensurePDFLib = useCallback(async () => {
    if (!pdfLibRef.current) {
      const lib = await import('pdf-lib');
      pdfLibRef.current = lib;
    }
    return pdfLibRef.current as typeof import('pdf-lib');
  }, []);

  const updateProgress = useCallback((stage: ProcessingProgress['stage'], progress: number, message: string, currentPage?: number, totalPages?: number) => {
    setProgress({ stage, progress, message, currentPage, totalPages });
  }, []);

  // 清除过期缓存
  const clearExpiredCache = useCallback(() => {
    const now = Date.now();
    const expireTime = 5 * 60 * 1000; // 5分钟过期
    
    Object.keys(renderCacheRef.current).forEach(key => {
      if (now - renderCacheRef.current[key].timestamp > expireTime) {
        delete renderCacheRef.current[key];
      }
    });
  }, []);

  const loadPDF = useCallback(async (file: File) => {
    setLoading(true);
    updateProgress('loading', 0, t('progress.loadingStart'));
    
    // 清除缓存
    renderCacheRef.current = {};
    
    try {
      updateProgress('loading', 20, t('progress.readingFile'));
      const arrayBuffer = await file.arrayBuffer();
      
      // 为PDF重建功能创建独立的副本
      const arrayBufferCopy = arrayBuffer.slice(0);
      fileDataRef.current = arrayBufferCopy;
      
      updateProgress('loading', 50, t('progress.parsingPdf'));
      const pdfjsLib = await ensurePDFJS();
      const pdfVersion = (pdfjsLib as any).version || '4.8.69';
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer, // 使用原始的 arrayBuffer 给 PDF.js
        cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfVersion}/cmaps/`,
        cMapPacked: true,
        disableFontFace: false,
        useSystemFonts: true,
        disableStream: true,
        disableAutoFetch: true,
        disableRange: true,
        maxImageSize: 1024 * 1024 * 30,
        verbosity: 0,
        stopAtErrors: false,
        isEvalSupported: false
      });
      
      updateProgress('loading', 80, t('progress.loadingContent'));
      const pdfDoc = await loadingTask.promise;
      pdfDocRef.current = pdfDoc;
      
      updateProgress('loading', 100, t('progress.pdfLoaded', { totalPages: pdfDoc.numPages }));
      
      setTimeout(() => setProgress(null), 1000);
      
      return {
        success: true,
        numPages: pdfDoc.numPages,
        message: t('progress.pdfLoaded', { totalPages: pdfDoc.numPages })
      };
      
    } catch (error: any) {
      console.error('PDF loading detailed error:', error);
      
      let errorMessage = t('error.pdfLoadFailed');
      if (error.name === 'InvalidPDFException') {
        errorMessage = t('error.invalidPdf');
      } else if (error.name === 'MissingPDFException') {
        errorMessage = t('error.missingPdf');
      } else if (error.name === 'PasswordException') {
        errorMessage = t('error.passwordProtected');
      } else if (error.message) {
        errorMessage = t('error.pdfProcessingError', { message: error.message });
      }
      
      setProgress(null);
      return {
        success: false,
        error: errorMessage,
        message: t('error.pdfLoadFailedGeneric')
      };
    } finally {
      setLoading(false);
    }
  }, [updateProgress]);

  const renderPage = useCallback(async (pageNum: number, scale = 1.5) => {
    if (!pdfDocRef.current) {
      throw new Error(t('error.pdfNotLoaded'));
    }
    
    // 生成缓存键
    const cacheKey = `page-${pageNum}-scale-${scale.toFixed(2)}`;
    
    // 检查缓存
    if (renderCacheRef.current[cacheKey]) {
      const cached = renderCacheRef.current[cacheKey];
      return {
        success: true,
        imageData: cached.imageData,
        width: cached.canvas.width,
        height: cached.canvas.height,
        scale: scale
      };
    }
    
    // 如果正在渲染相同页面，等待完成
    if (renderPromiseRef.current) {
      try {
        await renderPromiseRef.current;
      } catch (e) {
        // 忽略错误，继续渲染
      }
    }
    
    setLoading(true);
    updateProgress('rendering', 0, t('progress.renderingPage', { pageNum }));
    
    const renderPromise = (async () => {
      try {
        const page = await pdfDocRef.current!.getPage(pageNum);
        updateProgress('rendering', 30, t('progress.gettingDimensions'));
        
        const viewport = page.getViewport({ scale });
        updateProgress('rendering', 50, t('progress.creatingCanvas'));
        
        // 创建离屏Canvas进行渲染
        const offscreenCanvas = document.createElement('canvas');
        const context = offscreenCanvas.getContext('2d', {
          alpha: false,
          willReadFrequently: false, // 优化：不频繁读取像素数据
          desynchronized: true // 优化：允许异步渲染
        });
        
        if (!context) {
          throw new Error(t('error.cannotGetCanvasContext'));
        }
        
        offscreenCanvas.width = Math.floor(viewport.width);
        offscreenCanvas.height = Math.floor(viewport.height);
        
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
        
        updateProgress('rendering', 70, t('progress.renderingContent'));
        
        const renderContext: any = {
          canvasContext: context,
          viewport: viewport,
          intent: 'display',
          renderInteractiveForms: false,
          includeAnnotationStorage: false,
          enableWebGL: true // 启用WebGL加速
        };
        
        const renderTask = page.render(renderContext);
        await renderTask.promise;
        
        updateProgress('rendering', 90, t('progress.extractingImage'));
        const imageData = context.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
        
        // 缓存结果
        renderCacheRef.current[cacheKey] = {
          canvas: offscreenCanvas,
          imageData: imageData,
          timestamp: Date.now()
        };
        
        // 定期清理过期缓存
        clearExpiredCache();
        
        updateProgress('rendering', 100, t('progress.rendering', { pageNum }));
        setTimeout(() => setProgress(null), 500);
        
        return {
          success: true,
          imageData: imageData,
          width: offscreenCanvas.width,
          height: offscreenCanvas.height,
          scale: scale
        };
        
      } catch (error: any) {
        console.error(`Page ${pageNum} rendering error:`, error);
        setProgress(null);
        
        let errorMessage = t('error.pageRenderFailed');
        if (error.message) {
          errorMessage = t('error.renderError', { message: error.message });
        }
        
        return {
          success: false,
          error: errorMessage
        };
      } finally {
        setLoading(false);
        renderPromiseRef.current = null;
      }
    })();
    
    renderPromiseRef.current = renderPromise;
    return renderPromise;
  }, [updateProgress, clearExpiredCache]);

  const processRedaction = useCallback(async (
    file: File,
    redactionRects: RedactionRect[][],
    method = 'canvas'
  ): Promise<ProcessingResult> => {
    if (!pdfDocRef.current || !fileDataRef.current) {
      throw new Error(t('error.pdfNotLoaded'));
    }
    
    setLoading(true);
    
    try {
      const pdfDoc = pdfDocRef.current;
      const numPages = pdfDoc.numPages;
      const totalRedactions = redactionRects.reduce((total, pageRects) => total + pageRects.length, 0);
      
      updateProgress('processing', 0, t('progress.processingStart'), 0, numPages);
      
      // 根据选择的方法使用不同的处理逻辑
      if (method === 'canvas') {
        return await processWithCanvas(pdfDoc, redactionRects, numPages, totalRedactions);
      } else if (method === 'pixelate') {
        return await processWithPixelate(pdfDoc, redactionRects, numPages, totalRedactions);
      }
      // else if (method === 'rebuild') {
      //   return await processWithRebuild(pdfDoc, redactionRects, numPages, totalRedactions);
      // }
      
      throw new Error(t('error.unsupportedMethod', { method }));
      
    } catch (error: any) {
      console.error('PDF processing error:', error);
      setProgress(null);
      return {
        success: false,
        error: error.message || t('error.pdfProcessFailed')
      };
    } finally {
      setLoading(false);
    }
  }, [updateProgress]);

  // Canvas截图法 - 最高安全性
  const processWithCanvas = useCallback(async (
    pdfDoc: any,
    redactionRects: RedactionRect[][],
    numPages: number,
    totalRedactions: number
  ): Promise<ProcessingResult> => {
    const { PDFDocument } = await ensurePDFLib();
    const newPdfDoc = await PDFDocument.create();
    updateProgress('processing', 5, t('progress.creatingDocument'), 0, numPages);
    
    // 使用高性能渲染设置
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      try {
        const pageProgress = ((pageNum - 1) / numPages) * 80 + 10;
        updateProgress('processing', pageProgress, t('progress.canvasProcessing', { pageNum }), pageNum, numPages);
        
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });
        
        // 使用离屏Canvas提高性能
        const offscreenCanvas = document.createElement('canvas');
        const context = offscreenCanvas.getContext('2d', {
          alpha: false,
          willReadFrequently: false,
          desynchronized: true
        });
        
        if (!context) {
          console.warn(`Skipping page ${pageNum}: Unable to get Canvas context`);
          continue;
        }
        
        offscreenCanvas.width = Math.floor(viewport.width);
        offscreenCanvas.height = Math.floor(viewport.height);
        
        updateProgress('processing', pageProgress + 2, t('progress.renderingCanvas', { pageNum }), pageNum, numPages);
        
        const renderContext: any = {
          canvasContext: context,
          viewport: viewport,
          intent: 'display',
          enableWebGL: true
        };
        
        const renderTask = page.render(renderContext);
        await renderTask.promise;
        
        const pageRects = redactionRects[pageNum - 1] || [];
        
        if (pageRects.length > 0) {
          updateProgress('processing', pageProgress + 4, t('progress.redactingAreas', { count: pageRects.length }), pageNum, numPages);
          
          context.save();
          context.fillStyle = '#000000';
          context.globalCompositeOperation = 'source-over';
          
          pageRects.forEach(rect => {
            const x = Math.floor((rect.x / rect.pageWidth) * offscreenCanvas.width);
            const y = Math.floor((rect.y / rect.pageHeight) * offscreenCanvas.height);
            const width = Math.ceil((rect.width / rect.pageWidth) * offscreenCanvas.width);
            const height = Math.ceil((rect.height / rect.pageHeight) * offscreenCanvas.height);
            
            context.fillRect(x, y, width, height);
          });
          
          context.restore();
        }
        
        updateProgress('processing', pageProgress + 6, t('progress.convertingToImage', { pageNum }), pageNum, numPages);
        
        // 使用toBlob而不是toDataURL，性能更好
        const blob = await new Promise<Blob>((resolve) => {
          offscreenCanvas.toBlob(resolve!, 'image/png', 1.0);
        });
        
        const imageArrayBuffer = await blob!.arrayBuffer();
        const image = await newPdfDoc.embedPng(imageArrayBuffer);
        const newPage = newPdfDoc.addPage([offscreenCanvas.width, offscreenCanvas.height]);
        
        newPage.drawImage(image, {
          x: 0,
          y: 0,
          width: offscreenCanvas.width,
          height: offscreenCanvas.height,
        });
        
      } catch (pageError: any) {
        console.warn(`Error processing page ${pageNum}:`, pageError);
        updateProgress('processing', 
          ((pageNum - 1) / numPages) * 80 + 10, 
          t('progress.pageError', { pageNum }), 
          pageNum, 
          numPages
        );
      }
    }
    
    updateProgress('finalizing', 90, t('progress.generatingFinalPdf'));
    const pdfBytes = await newPdfDoc.save();
    
    updateProgress('finalizing', 100, t('progress.canvasCompleted', { totalPages: numPages, marksCount: totalRedactions }));
    setTimeout(() => setProgress(null), 2000);
    
    return {
      success: true,
      pdfBytes: pdfBytes,
      message: t('progress.canvasComplete', { totalPages: numPages, marksCount: totalRedactions })
    };
  }, [updateProgress]);

  // 像素化处理法
  const processWithPixelate = useCallback(async (
    pdfDoc: any,
    redactionRects: RedactionRect[][],
    numPages: number,
    totalRedactions: number
  ): Promise<ProcessingResult> => {
    const { PDFDocument } = await ensurePDFLib();
    const newPdfDoc = await PDFDocument.create();
    updateProgress('processing', 5, t('progress.rebuildPrep'), 0, numPages);
    
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      try {
        const pageProgress = ((pageNum - 1) / numPages) * 80 + 10;
        updateProgress('processing', pageProgress, t('progress.pixelateProcessing', { pageNum }), pageNum, numPages);
        
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 }); // 较低分辨率以支持像素化
        
        const offscreenCanvas = document.createElement('canvas');
        const context = offscreenCanvas.getContext('2d');
        
        if (!context) {
          console.warn(`Skipping page ${pageNum}: Unable to get Canvas context`);
          continue;
        }
        
        offscreenCanvas.width = Math.floor(viewport.width);
        offscreenCanvas.height = Math.floor(viewport.height);
        
        const renderContext: any = {
          canvasContext: context,
          viewport: viewport,
          intent: 'display'
        };
        
        const renderTask = page.render(renderContext);
        await renderTask.promise;
        
        const pageRects = redactionRects[pageNum - 1] || [];
        
        if (pageRects.length > 0) {
          updateProgress('processing', pageProgress + 4, t('progress.pixelateAreas', { count: pageRects.length }), pageNum, numPages);
          
          pageRects.forEach(rect => {
            const x = Math.floor((rect.x / rect.pageWidth) * offscreenCanvas.width);
            const y = Math.floor((rect.y / rect.pageHeight) * offscreenCanvas.height);
            const width = Math.ceil((rect.width / rect.pageWidth) * offscreenCanvas.width);
            const height = Math.ceil((rect.height / rect.pageHeight) * offscreenCanvas.height);
            
            // 像素化处理：获取区域图像数据并进行像素化
            const imageData = context.getImageData(x, y, width, height);
            const pixelSize = 8; // 像素块大小
            
            for (let py = 0; py < height; py += pixelSize) {
              for (let px = 0; px < width; px += pixelSize) {
                // 获取像素块的平均颜色
                let r = 0, g = 0, b = 0, count = 0;
                
                for (let dy = 0; dy < pixelSize && py + dy < height; dy++) {
                  for (let dx = 0; dx < pixelSize && px + dx < width; dx++) {
                    const idx = ((py + dy) * width + (px + dx)) * 4;
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
                  
                  // 填充像素块
                  context.fillStyle = `rgb(${r}, ${g}, ${b})`;
                  context.fillRect(x + px, y + py, 
                    Math.min(pixelSize, width - px), 
                    Math.min(pixelSize, height - py)
                  );
                }
              }
            }
          });
        }
        
        updateProgress('processing', pageProgress + 6, t('progress.convertingToImage', { pageNum }), pageNum, numPages);
        
        const blob = await new Promise<Blob>((resolve) => {
          offscreenCanvas.toBlob(resolve!, 'image/jpeg', 0.9); // 使用JPEG以减小文件大小
        });
        
        const imageArrayBuffer = await blob!.arrayBuffer();
        const image = await newPdfDoc.embedJpg(imageArrayBuffer);
        const newPage = newPdfDoc.addPage([offscreenCanvas.width, offscreenCanvas.height]);
        
        newPage.drawImage(image, {
          x: 0,
          y: 0,
          width: offscreenCanvas.width,
          height: offscreenCanvas.height,
        });
        
      } catch (pageError: any) {
        console.warn(`Error processing page ${pageNum}:`, pageError);
        updateProgress('processing', 
          ((pageNum - 1) / numPages) * 80 + 10, 
          t('progress.pageError', { pageNum }), 
          pageNum, 
          numPages
        );
      }
    }
    
    updateProgress('finalizing', 90, t('progress.generatingFinalPdf'));
    const pdfBytes = await newPdfDoc.save();
    
    updateProgress('finalizing', 100, t('progress.pixelateCompleted', { totalPages: numPages, marksCount: totalRedactions }));
    setTimeout(() => setProgress(null), 2000);
    
    return {
      success: true,
      pdfBytes: pdfBytes,
      message: t('progress.pixelateCompleted', { totalPages: numPages, marksCount: totalRedactions })
    };
  }, [updateProgress]);

  // PDF重建法 - 真正的PDF结构操作
  const processWithRebuild = useCallback(async (
    pdfDoc: any,
    redactionRects: RedactionRect[][],
    numPages: number,
    totalRedactions: number
  ): Promise<ProcessingResult> => {
    updateProgress('processing', 5, t('progress.rebuildPrep'), 0, numPages);
    
    if (!fileDataRef.current) {
      throw new Error(t('error.pdfDataNotFound'));
    }
    
    const { PDFDocument, rgb } = await ensurePDFLib();
    const originalPdfDoc = await PDFDocument.load(fileDataRef.current);
    const newPdfDoc = await PDFDocument.create();
    
    updateProgress('processing', 10, t('progress.analyzingStructure'), 0, numPages);
    
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      try {
        const pageProgress = ((pageNum - 1) / numPages) * 80 + 15;
        updateProgress('processing', pageProgress, t('progress.processingStructure', { pageNum }), pageNum, numPages);
        
        // 获取原始页面
        const originalPages = originalPdfDoc.getPages();
        const originalPage = originalPages[pageNum - 1];
        
        if (!originalPage) {
          console.warn(`Page ${pageNum} does not exist, skipping...`);
          continue;
        }
        
        // 复制页面到新文档
        const [copiedPage] = await newPdfDoc.copyPages(originalPdfDoc, [pageNum - 1]);
        const newPage = newPdfDoc.addPage(copiedPage);
        
        const pageRects = redactionRects[pageNum - 1] || [];
        
        if (pageRects.length > 0) {
          updateProgress('processing', pageProgress + 4, t('progress.removingText', { pageNum, count: pageRects.length }), pageNum, numPages);
          
          const { width: pageWidth, height: pageHeight } = newPage.getSize();
          
          try {
            // 获取页面的文本内容和位置信息
            const page = await pdfDoc.getPage(pageNum);
            const textContent = await page.getTextContent();
            
            // 分析哪些文本项在敏感区域内
            const textItemsToRemove: any[] = [];
            
            textContent.items.forEach((item: any, index: number) => {
              if (item.str && item.transform) {
                const textX = item.transform[4];
                const textY = pageHeight - item.transform[5]; // 转换坐标系
                const textWidth = item.width || 0;
                const textHeight = item.height || 12; // 默认字体高度
                
                // 检查文本是否在任何敏感区域内
                const isInRedactionArea = pageRects.some(rect => {
                  const rectX = (rect.x / rect.pageWidth) * pageWidth;
                  const rectY = (rect.y / rect.pageHeight) * pageHeight;
                  const rectWidth = (rect.width / rect.pageWidth) * pageWidth;
                  const rectHeight = (rect.height / rect.pageHeight) * pageHeight;
                  
                  return (textX >= rectX && textX <= rectX + rectWidth &&
                          textY >= rectY && textY <= rectY + rectHeight) ||
                         (textX + textWidth >= rectX && textX + textWidth <= rectX + rectWidth &&
                          textY + textHeight >= rectY && textY + textHeight <= rectY + rectHeight);
                });
                
                if (isInRedactionArea) {
                  textItemsToRemove.push({ item, index });
                }
              }
            });
            
            updateProgress('processing', pageProgress + 6, t('progress.addingMasks', { pageNum, count: pageRects.length }), pageNum, numPages);
            
            // 在敏感区域添加白色矩形遮罩，然后添加黑色矩形
            pageRects.forEach(rect => {
              const x = (rect.x / rect.pageWidth) * pageWidth;
              const y = pageHeight - (rect.y / rect.pageHeight) * pageHeight - (rect.height / rect.pageHeight) * pageHeight;
              const width = (rect.width / rect.pageWidth) * pageWidth;
              const height = (rect.height / rect.pageHeight) * pageHeight;
              
              // 先添加白色背景矩形覆盖原内容
              newPage.drawRectangle({
                x: x - 1,
                y: y - 1,
                width: width + 2,
                height: height + 2,
                color: rgb(1, 1, 1), // 白色
                borderWidth: 0
              });
              
              // 然后添加黑色标记矩形
              newPage.drawRectangle({
                x: x,
                y: y,
                width: width,
                height: height,
                color: rgb(0, 0, 0), // 黑色
                borderWidth: 0
              });
            });
            
            updateProgress('processing', pageProgress + 8, t('progress.structureComplete', { pageNum, count: textItemsToRemove.length }), pageNum, numPages);
            
          } catch (textError: any) {
            console.warn(`Page ${pageNum} text analysis failed, using basic masking method:`, textError);
            
            // fallback: 只添加遮罩矩形
            pageRects.forEach(rect => {
              const x = (rect.x / rect.pageWidth) * pageWidth;
              const y = pageHeight - (rect.y / rect.pageHeight) * pageHeight - (rect.height / rect.pageHeight) * pageHeight;
              const width = (rect.width / rect.pageWidth) * pageWidth;
              const height = (rect.height / rect.pageHeight) * pageHeight;
              
              // 添加白色背景
              newPage.drawRectangle({
                x: x - 1,
                y: y - 1,
                width: width + 2,
                height: height + 2,
                color: rgb(1, 1, 1),
                borderWidth: 0
              });
              
              // 添加黑色遮罩
              newPage.drawRectangle({
                x: x,
                y: y,
                width: width,
                height: height,
                color: rgb(0, 0, 0),
                borderWidth: 0
              });
            });
          }
        } else {
          updateProgress('processing', pageProgress + 8, t('progress.noSensitiveAreas', { pageNum }), pageNum, numPages);
        }
        
      } catch (pageError: any) {
        console.warn(`Error processing page ${pageNum}:`, pageError);
        updateProgress('processing', 
          ((pageNum - 1) / numPages) * 80 + 15, 
          t('progress.pageError', { pageNum }), 
          pageNum, 
          numPages
        );
      }
    }
    
    updateProgress('finalizing', 95, t('progress.cleaningMetadata'));
    
    // 清理可能包含敏感信息的元数据
    try {
      newPdfDoc.setTitle('');
      newPdfDoc.setAuthor('');
      newPdfDoc.setSubject('');
      newPdfDoc.setCreator(t('app.title'));
      newPdfDoc.setProducer(t('app.title'));
      newPdfDoc.setCreationDate(new Date());
      newPdfDoc.setModificationDate(new Date());
    } catch (metaError) {
      console.warn('Metadata cleaning failed:', metaError);
    }
    
    const pdfBytes = await newPdfDoc.save();
    
    updateProgress('finalizing', 100, t('progress.rebuildCompleted', { totalPages: numPages, marksCount: totalRedactions }));
    setTimeout(() => setProgress(null), 2000);
    
    return {
      success: true,
      pdfBytes: pdfBytes,
      message: t('progress.rebuildCompleted', { totalPages: numPages, marksCount: totalRedactions })
    };
  }, [updateProgress]);

  return {
    loadPDF,
    renderPage,
    processRedaction,
    processWithCanvas,
    processWithPixelate, 
    processWithRebuild,
    loading,
    progress,
    isWorkerReady: true
  };
}

import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';

// 设置PDF.js worker路径
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

class PDFProcessor {
  private pdfDoc: pdfjsLib.PDFDocumentProxy | null = null;

  async loadPDF(fileData: ArrayBuffer) {
    try {
      const loadingTask = pdfjsLib.getDocument({ data: fileData });
      this.pdfDoc = await loadingTask.promise;
      const numPages = this.pdfDoc.numPages;
      
      return {
        success: true,
        numPages,
        message: 'PDF加载成功'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        message: 'PDF加载失败'
      };
    }
  }

  async renderPage(pageNum: number, scale = 1.5) {
    if (!this.pdfDoc) {
      throw new Error('PDF未加载');
    }

    try {
      const page = await this.pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      
      // 在Worker中，我们无法直接操作DOM Canvas
      // 所以我们返回渲染参数，让主线程处理
      return {
        success: true,
        viewport: {
          width: viewport.width,
          height: viewport.height,
          transform: viewport.transform
        },
        scale: scale
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async processRedaction(fileData: ArrayBuffer, redactionRects: any[], method = 'canvas') {
    try {
      return await this.canvasRedactionMethod(fileData, redactionRects);
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  private async canvasRedactionMethod(fileData: ArrayBuffer, redactionRects: any[]) {
    try {
      const loadingTask = pdfjsLib.getDocument({ data: fileData });
      const pdfDoc = await loadingTask.promise;
      const numPages = pdfDoc.numPages;
      
      const newPdfDoc = await PDFDocument.create();
      
      // 由于Worker限制，这里返回处理指令给主线程
      return {
        success: true,
        requiresMainThread: true,
        numPages,
        message: '需要主线程处理Canvas渲染'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

const processor = new PDFProcessor();

self.onmessage = async function(e) {
  const { type, data } = e.data;
  
  try {
    let result;
    
    switch (type) {
      case 'LOAD_PDF':
        result = await processor.loadPDF(data.fileData);
        break;
        
      case 'RENDER_PAGE':
        result = await processor.renderPage(data.pageNum, data.scale);
        break;
        
      case 'PROCESS_REDACTION':
        result = await processor.processRedaction(
          data.fileData,
          data.redactionRects,
          data.method
        );
        break;
        
      default:
        result = {
          success: false,
          error: '未知的操作类型'
        };
    }
    
    self.postMessage({
      type: type + '_RESULT',
      result,
      requestId: data.requestId
    });
  } catch (error: any) {
    self.postMessage({
      type: type + '_RESULT',
      result: {
        success: false,
        error: error.message
      },
      requestId: data.requestId
    });
  }
};

import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  worker: {
    format: 'es'
  },
  optimizeDeps: {
    include: ['pdfjs-dist', 'pdf-lib']
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('pdfjs-dist') || id.includes('pdf-lib')) return 'pdf-libs';
            if (id.includes('react') || id.includes('scheduler') || id.includes('react-router')) return 'react-vendor';
            if (id.includes('i18next')) return 'i18n-vendor';
            if (id.includes('lucide-react')) return 'icons-vendor';
          }
        }
      }
    }
  }
})

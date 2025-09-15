import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
    rollupOptions: {
      output: {
        manualChunks: {
          'pdf-libs': ['pdfjs-dist', 'pdf-lib']
        }
      }
    }
  }
})

# 🔒 Secure PDF Editor

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A secure, privacy‑first PDF redaction editor. All processing happens locally in your browser — no files are uploaded and no data ever leaves your device.

Translations: [中文 (Simplified Chinese)](readme/README.zh-CN.md) • [Français](readme/README.fr.md)

---

## ✨ Features

### 🔐 Privacy & Security
- 100% local processing: runs entirely in the browser
- No uploads, no network requests, no server storage
- In‑memory processing only; nothing persists after refresh
- Metadata cleanup on export to reduce residual traces

### 📝 Redaction Methods
- Visual selection: drag to mark sensitive areas
- Two built‑in methods:
  - Canvas render: converts pages to images; strongest, unrecoverable
  - Pixelation: mosaics marked areas while keeping page layout
- Real‑time preview, undo/redo, and color‑coded marks

### 🌍 Internationalization
- English (default), 简体中文, Français (UI language selector included)

### 🎨 UX
- Responsive layout for desktop and mobile
- Thumbnail navigation, zoom controls, fit‑to‑width
- Keyboard shortcuts for fast editing

---

## 🚀 Quick Start

### Requirements
- Node.js 18+
- npm, yarn, or pnpm

### Setup
1. Clone
   ```bash
   git clone https://github.com/jyxwant/secure-pdf-editor.git
   cd secure-pdf-editor
   ```
2. Install
   ```bash
   npm install
   ```
3. Develop
   ```bash
   npm run dev
   ```
4. Open
   ```
   http://localhost:5173
   ```

### Production
```bash
npm run build
npm run preview
```

---

## 🛠 Usage

1. Upload a PDF (max 50MB; password‑protected files not supported)
2. Drag to mark sensitive areas (text, images, regions)
3. Preview the effect
4. Choose a method (Canvas render or Pixelation)
5. Download the secured PDF

Keyboard shortcuts:

| Shortcut | Action |
|----------|--------|
| `←` `→` | Navigate pages |
| `+` `-` | Zoom in / out |
| `0` | Reset zoom |
| `F` | Fit to width |
| `Space` | Toggle pan mode |
| `Delete` | Remove selected mark |
| `Ctrl+Z` `Ctrl+Y` | Undo / Redo |
| `Esc` | Cancel current action |

---

## 🏗 Tech Stack

- React 18 + TypeScript
- Vite 6 + Tailwind CSS
- PDF.js for rendering
- pdf-lib for PDF generation/manipulation
- i18next + react‑i18next (+ browser language detector)

---

## 📁 Project Structure

```
src/
├── components/
│   ├── pdf/              # FileUploader, PDFViewer, Toolbar, ThumbnailView
│   ├── LanguageSelector.tsx
│   └── ...
├── hooks/                # usePDFProcessor (rendering + redaction)
├── i18n/                 # i18n resources
├── lib/                  # utils
└── workers/              # pdf.worker
```

---

## 🧪 Testing

End‑to‑end tests use Playwright.

```bash
npm run test      # headless
npm run test:ui   # with UI
```

---

## 🔒 Security Notes

- No network requests; all work is local in the browser
- Export cleans common metadata fields
- Canvas render produces rasterized pages; sensitive content is not recoverable
- Pixelation masks areas visually while keeping overall layout

---

## 💬 Feedback

- Issues: https://github.com/jyxwant/secure-pdf-editor/issues
- Repo: https://github.com/jyxwant/secure-pdf-editor

---

## 📚 Readme Translations

- 中文（简体）: readme/README.zh-CN.md
- Français: readme/README.fr.md

---

## 🔗 Related Tools

- [MojisuCount](https://mojisucount.com/) — A privacy-first Japanese character counter that runs entirely in your browser.

---

## 📝 License

MIT License — see LICENSE for details.

<div align="center">

If this project helps you, a star is appreciated!

Made with ❤️ for privacy and security

</div>

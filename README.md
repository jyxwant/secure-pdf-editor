# 🔒 Secure PDF Editor

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A **secure, privacy-focused PDF editor** with redaction capabilities. All processing happens locally in your browser - no data ever leaves your device.

---

## ✨ Features

### 🔐 **Complete Privacy & Security**
- **100% Local Processing** - No data transmission to servers
- **No File Upload** - All operations happen in your browser
- **Instant Processing** - No waiting for server responses
- **Privacy by Design** - Your sensitive documents never leave your device

### 📝 **PDF Redaction Capabilities**
- **Visual Selection** - Drag and drop to mark sensitive areas
- **Multiple Processing Methods**:
  - 🎨 **Canvas Screenshot** - Convert to image (highest security, unrecoverable)
  - 🔲 **Pixelation** - Blur sensitive content while maintaining PDF structure
- **Real-time Preview** - See exactly how your redacted PDF will look
- **Undo/Redo Support** - Easily correct mistakes

### 🌍 **Multi-Language Support**
Support for **8 languages** including UN official languages:
- 🇺🇸 **English** (Default)
- 🇨🇳 **中文 (Chinese)**
- 🇫🇷 **Français (French)**
- 🇪🇸 **Español (Spanish)**
- 🇸🇦 **العربية (Arabic)**
- 🇷🇺 **Русский (Russian)**
- 🇯🇵 **日本語 (Japanese)**
- 🇰🇷 **한국어 (Korean)**

### 🎨 **Modern User Experience**
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Intuitive Interface** - Easy-to-use drag-and-drop functionality
- **Thumbnail Navigation** - Quick page navigation and overview
- **Zoom Controls** - Precise editing with zoom in/out
- **Color-Coded Marks** - Distinguish different types of sensitive information

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.0.0 or higher
- **npm**, **yarn**, or **pnpm**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/secure-pdf-editor.git
   cd secure-pdf-editor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Production Build

```bash
npm run build
npm run preview
```

---

## 🛠 Usage

### Basic Workflow

1. **📁 Upload PDF** - Drag and drop or click to select your PDF file (max 50MB)
2. **✏️ Mark Sensitive Areas** - Drag to select text, images, or areas to redact
3. **👀 Preview** - Check how your redacted document will look
4. **⚙️ Choose Method** - Select Canvas (highest security) or Pixelation
5. **💾 Download** - Get your secure PDF with sensitive information permanently removed

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `←` `→` | Navigate pages |
| `+` `-` | Zoom in/out |
| `F` | Fit to width |
| `Space` | Toggle view mode |
| `Delete` | Remove selected mark |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Esc` | Cancel current action |

---

## 🏗 Technology Stack

### Core Technologies
- **⚛️ React 18** - Modern React with hooks and TypeScript
- **📘 TypeScript** - Type safety and better development experience
- **⚡ Vite** - Lightning-fast build tool and dev server
- **🎨 Tailwind CSS** - Utility-first CSS framework

### PDF Processing
- **📄 PDF.js** - Mozilla's PDF rendering library
- **📝 PDF-lib** - PDF creation and manipulation
- **🖥️ HTML2Canvas** - Canvas-based screenshot generation

### Internationalization
- **🌐 react-i18next** - React integration for i18next
- **🗣️ i18next** - Internationalization framework
- **🔍 i18next-browser-languagedetector** - Automatic language detection

---

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── pdf/             # PDF-specific components
│   │   ├── FileUploader.tsx
│   │   ├── PDFViewer.tsx
│   │   ├── Toolbar.tsx
│   │   └── ThumbnailView.tsx
│   ├── LanguageSelector.tsx
│   └── ...
├── hooks/               # Custom React hooks
├── i18n/               # Internationalization
│   └── index.ts        # Language definitions
├── lib/                # Utility functions
└── workers/            # Web Workers
```

---

## 🧪 Testing

```bash
# Run end-to-end tests
npm run test

# Run tests with UI
npm run test:ui
```

---

## 🔒 Security & Privacy

### Security Features
- ✅ **No Network Requests** - All processing happens locally
- ✅ **No Data Storage** - Files are processed in memory only
- ✅ **Secure Redaction** - Multiple redaction methods available
- ✅ **Complete Removal** - Sensitive data is permanently unrecoverable

### Privacy Guarantee
**Your privacy is our priority.** This application:
- Does **NOT** upload your files to any server
- Does **NOT** store your files locally
- Does **NOT** collect any user data
- Does **NOT** require registration or login

---

## 🎉 Acknowledgments

- **Mozilla PDF.js** - For excellent PDF rendering capabilities
- **Tailwind CSS** - For beautiful, utility-first styling
- **React Community** - For the amazing ecosystem

---

<div align="center">

**⭐ If this project helps you, please consider giving it a star! ⭐**

Made with ❤️ for privacy and security

</div>
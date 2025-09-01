# 🔒 Secure PDF Editor | 安全PDF涂黑编辑器

[English](../README.md) • [Français](README.fr.md)

一个注重隐私与安全的 PDF 涂黑编辑器。所有处理均在浏览器本地完成，不会上传任何文件或数据到服务器。

---

## ✨ 功能亮点

- 本地处理：不走网络，无上传、无数据存储
- 可视化标记：鼠标拖拽圈选敏感区域
- 两种处理方式：
  - Canvas 渲染法：将页面光栅化为图像，安全性最高、不可恢复
  - 像素化处理：对标记区域做马赛克，同时保持页面结构
- 实时预览、撤销/重做、标记颜色区分
- 内置多语言：英文（默认）/ 简体中文 / 法语

---

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm / yarn / pnpm

### 安装与启动
```bash
git clone https://github.com/jyxwant/secure-pdf-editor.git
cd secure-pdf-editor
npm install
npm run dev
# 打开浏览器访问 http://localhost:5173
```

### 生产构建
```bash
npm run build
npm run preview
```

---

## 🛠 使用说明

1. 上传 PDF（最大 50MB；暂不支持加密/有密码文件）
2. 拖拽标记敏感区域（文本、图片、任意区域）
3. 预览涂黑效果
4. 选择处理方式（Canvas 渲染 或 像素化）
5. 下载处理后的安全 PDF

快捷键：

| 快捷键 | 功能 |
|--------|------|
| `←` `→` | 上/下一页 |
| `+` `-` | 放大/缩小 |
| `0` | 重置缩放 |
| `F` | 适配宽度 |
| `Space` | 切换拖拽平移模式 |
| `Delete` | 删除选中的标记 |
| `Ctrl+Z` `Ctrl+Y` | 撤销 / 重做 |
| `Esc` | 取消当前操作 |

---

## 🏗 技术栈

- React 18 + TypeScript
- Vite 6 + Tailwind CSS
- PDF.js（渲染）
- pdf-lib（生成与处理）
- i18next + react‑i18next（多语言）

---

## 📁 目录结构

```
src/
├── components/
│   ├── pdf/              # PDFViewer / FileUploader / Toolbar / ThumbnailView
│   ├── LanguageSelector.tsx
│   └── ...
├── hooks/                # usePDFProcessor（渲染与涂黑流程）
├── i18n/                 # 多语言资源
├── lib/                  # 工具函数
└── workers/              # pdf.worker
```

---

## 🧪 测试

项目使用 Playwright 做端到端测试：

```bash
npm run test      # 无头模式
npm run test:ui   # UI 模式
```

---

## 🔒 安全说明

- 全程本地处理，不发起网络请求
- 导出前清理常见 PDF 元数据
- Canvas 渲染法会将页面转成位图，敏感内容不可恢复
- 像素化方式对可视外观做马赛克处理，同时尽量保持页面布局

---

## 💬 反馈与建议

- Issue 入口：https://github.com/jyxwant/secure-pdf-editor/issues
- 仓库地址：https://github.com/jyxwant/secure-pdf-editor

---

## 📚 README 多语言

- English（默认）: ../README.md
- Français: README.fr.md

---

## 📝 许可证

MIT License（详见根目录 LICENSE）

> 如果这个项目对你有帮助，欢迎点亮 Star！

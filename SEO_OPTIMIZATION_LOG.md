# SecureRedact SEO 优化与最佳实践记录

本文档记录了项目在 SEO 优化过程中遇到的关键问题、根本原因及最终解决方案。请在后续开发中参考此文档，避免重复踩坑。

## 1. 页面架构：Server vs Client Component

### ❌ 问题
直接在标记为 `'use client'` 的页面组件中导出 `generateMetadata`。
**后果**：Next.js 忽略客户端组件中的 Metadata，导致页面回退使用 Layout 中的默认元数据。Semrush 报告 **"Duplicate Meta Descriptions"**（重复元数据）错误。

### ✅ 解决方案
采用 **Server-Client 分离模式**。
*   **Page (Server)**: 负责数据获取和 Metadata 生成。
*   **Client (Client)**: 负责 UI 交互和 Hooks (如 `useTranslation`)。

**代码范式**：
```typescript
// src/app/[lang]/editor/page.tsx (Server Component)
import { Metadata } from 'next';
import EditorClient from './EditorClient';

export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: '...',
    description: '...',
    // ...
  };
}

export default function Page() {
  return <EditorClient />;
}
```

---

## 2. URL 策略：隐藏默认语言前缀 (Rewrite Mode)

### ❌ 问题 (旧方案)
默认语言使用 `/en` 前缀（Redirect Mode）。
*   访问 `/` -> 308 跳转 -> `/en`。
*   **后果**：根域名 `secureredact.tech` 没有实际内容，权重分散；外链通常指向根域名，导致一次跳转损耗。

### ✅ 解决方案 (新方案)
使用 **Rewrite Mode** 隐藏默认语言前缀。
*   访问 `/` -> 内部重写显示 `/en` 内容 (URL 保持 `/`, 状态码 200)。
*   访问 `/en` -> 308 跳转 -> `/` (防止重复内容)。
*   其他语言 (`/zh`, `/fr`) 保持带前缀。

**Middleware 关键逻辑**：
```typescript
// middleware.ts
// 1. 强制 /en 跳转回 /
if (pathname.startsWith('/en')) {
  return NextResponse.redirect(new URL(pathname.replace(/^\/en/, '') || '/', request.url), 308);
}
// 2. 无前缀路径 Rewrite 到默认语言
return NextResponse.rewrite(new URL(`/${defaultLocale}${pathname}`, request.url));
```

---

## 3. Metadata 配置：Canonical & Hreflang

### ❌ 问题
*   `canonical` 指向了带 `/en` 的 URL（现在是重定向地址）。
*   缺少 `x-default`，或 `x-default` 指向了重定向地址。
*   **后果**：Semrush 报告 **"Incorrect Hreflang Link"** 或 **"Hreflang redirect"**。

### ✅ 解决方案
所有链接必须指向**最终状态码为 200 的 URL**。
*   对于英文版：使用 `https://secureredact.tech/foo` (无 `/en`)。
*   对于其他语言：使用 `https://secureredact.tech/zh/foo`。

**Metadata 模板**：
```typescript
const currentUrl = lang === 'en' ? 'https://site.com' : `https://site.com/${lang}`;

return {
  alternates: {
    canonical: currentUrl,
    languages: {
      'en': 'https://site.com',       // ❌ 不要写 /en
      'zh': 'https://site.com/zh',
      'x-default': 'https://site.com' // 通常指向英文版(无前缀)
    }
  }
}
```

---

## 4. Sitemap 配置

### ❌ 问题
Sitemap 生成逻辑简单地将 `${baseUrl}/${lang}/${path}` 拼接。
**后果**：生成的 Sitemap 包含 `https://site.com/en/...`，Google 抓取时遇到 308 跳转，导致收录效率下降或报错。

### ✅ 解决方案
在生成 Sitemap 时，对默认语言进行特殊处理，移除前缀。

**代码修正**：
```typescript
// src/app/sitemap.ts
targetLanguages.forEach((lang) => {
  // 关键：如果是默认语言，前缀为空
  const langPrefix = lang === 'en' ? '' : `/${lang}`;
  
  sitemap.push({
    url: `${baseUrl}${langPrefix}${config.path}`,
    // ...
  });
});
```

---

## 5. 博客与动态内容

### ❌ 问题
博客详情页如果是静态文件夹（非 `[slug]` 动态路由），容易被遗忘添加 Metadata。
**后果**：所有博客文章共享同一个 Title/Description，导致严重的重复内容问题。

### ✅ 解决方案
即使是静态路由的博客文章，也必须遵循 **Server-Client 分离模式**，为每篇文章单独配置 `generateMetadata`。

---

## 总结检查清单

在发布新页面前，请检查：
1.  [ ] 页面是否拆分为 `page.tsx` (Server) 和 `Client.tsx`?
2.  [ ] `page.tsx` 是否导出了独立的 `generateMetadata`?
3.  [ ] `canonical` 和 `hreflang` 链接是否正确处理了默认语言（去掉了 `/en`）?
4.  [ ] `sitemap.ts` 是否包含了新页面，且 URL 格式正确?
5.  [ ] 访问 `/en/new-page` 是否会自动跳转到 `/new-page`?

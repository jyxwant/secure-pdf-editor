import React from 'react';
import { HomePage } from './HomePage';
import { SEOHead } from '../components/SEO/SEOHead';

interface ChinesePageProps {
  onFileSelect: (file: File) => void;
  loading: boolean;
}

export function ChinesePage(props: ChinesePageProps) {
  return (
    <>
      <SEOHead
        title="PDF安全编辑器 - 专业PDF涂黑工具 | 本地处理，永久删除敏感信息"
        description="免费在线PDF涂黑与隐私保护工具，全部在浏览器本地处理，无需上传。支持区域涂黑与像素化，永久删除底层文本与图像数据，满足GDPR/HIPAA。"
        keywords="PDF涂黑,PDF编辑器,隐私保护,文档安全,敏感信息处理,本地处理,GDPR,HIPAA"
        canonicalUrl="/zh"
        lang="zh"
        alternates={{ en: 'https://secureredact.tech/', zh: 'https://secureredact.tech/zh', fr: 'https://secureredact.tech/fr' }}
      />
      <HomePage {...props} withSEO={false} />
    </>
  );
}

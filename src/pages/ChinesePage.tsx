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
        title="PDF安全编辑器 - 专业PDF涂黑工具"
        description="安全地隐藏敏感信息，所有处理都在浏览器本地完成。支持PDF文档敏感信息涂黑、隐私保护。"
        keywords="PDF编辑器,PDF涂黑,文档安全,隐私保护,敏感信息处理,本地处理"
        canonicalUrl="/zh"
      />
      <HomePage {...props} />
    </>
  );
}
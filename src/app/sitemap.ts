import { MetadataRoute } from 'next';

const baseUrl = 'https://secureredact.tech';

// 支持的语言列表
const languages = ['en', 'zh', 'fr'];

// 定义路由配置类型
type RouteConfig = {
  path: string;
  lastModified: string; // 必须明确指定时间，避免每次生成都变动
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  languages?: string[]; // 可选：指定该页面支持的语言，如果不填则默认支持所有语言
};

// 页面配置列表
// 当您修改了某个页面的内容时，请手动更新这里的 lastModified
const routeConfigs: RouteConfig[] = [
  // 核心页面
  { 
    path: '', 
    lastModified: '2026-01-29', 
    changeFrequency: 'weekly', 
    priority: 1.0 
  },
  { 
    path: '/editor', 
    lastModified: '2026-01-29', 
    changeFrequency: 'weekly', 
    priority: 0.9 
  },
  
  // 营销页面
  { 
    path: '/features', 
    lastModified: '2026-01-29', 
    changeFrequency: 'monthly', 
    priority: 0.8 
  },
  { 
    path: '/guide', 
    lastModified: '2026-01-29', 
    changeFrequency: 'monthly', 
    priority: 0.8 
  },
  { 
    path: '/faq', 
    lastModified: '2026-01-29', 
    changeFrequency: 'monthly', 
    priority: 0.8 
  },
  
  // 博客列表
  { 
    path: '/blog', 
    lastModified: '2026-01-29', 
    changeFrequency: 'weekly', 
    priority: 0.9 
  },
  
  // 博客文章
  { 
    path: '/blog/how-to-redact-pdf', 
    lastModified: '2026-01-29', 
    changeFrequency: 'monthly', 
    priority: 0.8 
  },
  { 
    path: '/blog/redact-pdf-free', 
    lastModified: '2026-01-29', 
    changeFrequency: 'monthly', 
    priority: 0.8 
  },
  // English-only technical post
  {
    path: '/blog/how-to-black-out-ssn-on-pdf',
    lastModified: '2026-01-29', 
    changeFrequency: 'monthly',
    priority: 0.8,
    languages: ['en']
  },
  {
    path: '/blog/adobe-acrobat-free-alternative-2026',
    lastModified: '2026-01-29', 
    changeFrequency: 'monthly',
    priority: 0.8,
    languages: ['en']
  },
  
  // 法律页面
  { 
    path: '/legal/about', 
    lastModified: '2026-01-29', 
    changeFrequency: 'yearly', 
    priority: 0.5 
  },
  { 
    path: '/legal/privacy', 
    lastModified: '2026-01-29', 
    changeFrequency: 'yearly', 
    priority: 0.5 
  },
  { 
    path: '/legal/terms', 
    lastModified: '2026-01-29', 
    changeFrequency: 'yearly', 
    priority: 0.5 
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemap: MetadataRoute.Sitemap = [];

  routeConfigs.forEach((config) => {
    const targetLanguages = config.languages || languages;
    targetLanguages.forEach((lang) => {
      // 关键修改：如果是 'en'，不添加语言前缀
      const langPrefix = lang === 'en' ? '' : `/${lang}`;
      
      sitemap.push({
        url: `${baseUrl}${langPrefix}${config.path}`,
        lastModified: new Date(config.lastModified),
        changeFrequency: config.changeFrequency,
        priority: config.priority,
      });
    });
  });

  return sitemap;
}

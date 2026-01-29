import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

const locales = ['en', 'zh', 'fr']
const defaultLocale = 'en'

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  // @ts-ignore
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  
  try {
    return matchLocale(languages, locales, defaultLocale)
  } catch (e) {
    return defaultLocale
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // 排除静态资源和 API 路由
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') || 
    pathname === '/favicon.ico'
  ) {
    return
  }

  // 1. 如果访问的是 /en 或 /en/...，强制重定向到无前缀版本 (308 Permanent Redirect)
  // 这是为了防止重复内容 (/en 和 / 内容一样)
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const newPath = pathname.replace(/^\/en/, '') || '/'
    return NextResponse.redirect(new URL(newPath, request.url), 308)
  }

  // 2. 检查路径是否包含其他语言前缀 (zh, fr)
  const pathnameHasLocale = locales.some(
    (locale) => locale !== defaultLocale && (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // 3. 处理无前缀路径 (隐含为英文)
  
  // 特殊情况：如果是根路径 '/'，且用户偏好非默认语言，跳转到对应语言
  if (pathname === '/') {
    const preferredLocale = getLocale(request)
    if (preferredLocale !== defaultLocale) {
      return NextResponse.redirect(new URL(`/${preferredLocale}`, request.url))
    }
  }

  // 4. 对于所有无前缀的路径 (视为默认语言)，Rewrite 到 /en/...
  // 这样 Next.js 的 [lang] 路由才能捕获到 params.lang = 'en'
  return NextResponse.rewrite(
    new URL(`/${defaultLocale}${pathname}`, request.url)
  )
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico).*)',
  ],
}

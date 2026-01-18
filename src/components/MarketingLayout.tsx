'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Shield, Github, Menu, X } from 'lucide-react';
import { LanguageSelector } from '@/components/LanguageSelector';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path || (path !== '/' && pathname.startsWith(path));

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/guide', label: t('nav.guide') },
    { path: '/blog', label: t('nav.blog') },
  ];

  const footerLinks = [
    { path: '/legal/about', label: t('nav.about') },
    { path: '/legal/privacy', label: t('nav.privacy') },
    { path: '/legal/terms', label: t('nav.terms') },
  ];

  return (
    <div className="min-h-screen bg-[#f0f0f0] flex flex-col font-sans selection:bg-yellow-200 selection:text-black">
      {/* Navigation */}
      <nav className="bg-white border-b-2 border-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                <div className="neo-box-sm p-1 mr-3 flex items-center justify-center bg-blue-600 border-black border-2">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-black text-gray-900 tracking-tight uppercase hidden sm:block">{t('app.title')}</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`px-4 py-2 text-sm font-bold border-2 border-transparent hover:border-black hover:bg-yellow-200 transition-all ${
                    isActive(link.path) ? 'bg-yellow-300 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'text-gray-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <a
                href="https://github.com/jyxwant/secure-pdf-editor"
                target="_blank"
                rel="noopener noreferrer"
                className="neo-btn-sm bg-white hover:bg-gray-100 flex items-center"
                title={t('app.viewOnGitHub')}
              >
                <Github className="w-5 h-5" />
              </a>
              <LanguageSelector />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="neo-btn-sm bg-white text-gray-900 focus:outline-none p-2"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b-2 border-black">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 text-base font-bold border-2 border-transparent ${
                    isActive(link.path)
                      ? 'bg-yellow-300 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'text-gray-700 hover:bg-yellow-100 hover:border-black'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-3 py-2 flex items-center justify-between border-t-2 border-black mt-2 pt-4">
                 <a
                  href="https://github.com/jyxwant/secure-pdf-editor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 font-bold flex items-center"
                >
                  <Github className="w-5 h-5 mr-2" />
                  GitHub
                </a>
                <LanguageSelector />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-black relative z-10">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${i18n.language === 'fr' ? 'py-6' : 'py-8'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Project Info */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <div className="neo-box-sm p-1 bg-blue-600 border-black border-2">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="font-black text-gray-900 uppercase">{t('app.title')}</span>
              </div>
            </div>
            
            {/* Links */}
            <div className="flex justify-center space-x-6 flex-wrap gap-y-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="text-sm font-bold text-gray-600 hover:text-black hover:underline decoration-2 underline-offset-4 transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            {/* Social / Actions */}
            <div className="flex justify-end items-center space-x-4">
              <a
                href="https://github.com/jyxwant/secure-pdf-editor"
                target="_blank"
                rel="noopener noreferrer"
                className="neo-btn-sm bg-gray-900 text-white hover:bg-black transition-colors flex items-center"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t-2 border-black text-center">
            <p className="text-sm font-bold text-gray-500">
              © {new Date().getFullYear()} Secure PDF Editor. {t('footer.madeWith')}.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

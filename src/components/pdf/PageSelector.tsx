import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Search } from 'lucide-react';

interface PageSelectorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PageSelector: React.FC<PageSelectorProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 生成页面列表
  const filteredPages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(page => 
      searchTerm === '' || page.toString().includes(searchTerm)
    );

  const handlePageSelect = (page: number) => {
    onPageChange(page);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium bg-gray-50 rounded-md hover:bg-gray-100 transition-colors min-w-[80px] justify-center"
      >
        <span>{currentPage}</span>
        <span className="text-gray-400">/</span>
        <span className="text-gray-600">{totalPages}</span>
        <ChevronDown className="w-4 h-4 text-gray-500 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-64">
          {/* Search box */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('nav.searchPage')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Page list */}
          <div className="max-h-64 overflow-y-auto">
            {filteredPages.length > 0 ? (
              <div className="p-2">
                {filteredPages.map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageSelect(page)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      page === currentPage
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {t('pdf.page', { number: page })}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                {t('pageSelector.noMatch')}
              </div>
            )}
          </div>

          {/* Quick navigation */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-600">{t('pageSelector.quickJump')}:</span>
              <div className="flex space-x-1">
                <button
                  onClick={() => handlePageSelect(1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('nav.firstPage')}
                </button>
                <button
                  onClick={() => handlePageSelect(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('nav.lastPage')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
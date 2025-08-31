import React from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Trash2, Eye, Shield, Layers, Zap, Settings, Undo2, Redo2, Palette } from 'lucide-react';

interface ToolbarProps {
  redactionMethod: 'canvas' | 'pixelate' | 'rebuild';
  onMethodChange: (method: 'canvas' | 'pixelate' | 'rebuild') => void;
  onProcess: () => void;
  onClear: () => void;
  onPreview: () => void;
  onUndo: () => void;
  onRedo: () => void;
  processing: boolean;
  hasRedactions: boolean;
  canUndo: boolean;
  canRedo: boolean;
  selectedColor?: string;
  onColorChange?: (color: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  redactionMethod,
  onMethodChange,
  onProcess,
  onClear,
  onPreview,
  onUndo,
  onRedo,
  processing,
  hasRedactions,
  canUndo,
  canRedo,
  selectedColor = 'red',
  onColorChange
}) => {
  const { t } = useTranslation();
  
  // 在组件内定义methods，这样可以使用t函数
  const methods = [
    {
      id: 'canvas' as const,
      name: t('toolbar.methods.canvas'),
      description: t('toolbar.methods.canvasDesc'),
      icon: Layers,
      recommended: true,
      color: 'blue'
    },
    {
      id: 'pixelate' as const,
      name: t('toolbar.methods.pixelate'),
      description: t('toolbar.methods.pixelateDesc'),
      icon: Shield,
      recommended: false,
      color: 'purple'
    }
  ];
  
  const colors = [
    { id: 'red', name: t('toolbar.colors.red'), value: '#ef4444', bgClass: 'bg-red-500' },
    { id: 'blue', name: t('toolbar.colors.blue'), value: '#3b82f6', bgClass: 'bg-blue-500' },
    { id: 'green', name: t('toolbar.colors.green'), value: '#22c55e', bgClass: 'bg-green-500' },
    { id: 'yellow', name: t('toolbar.colors.yellow'), value: '#eab308', bgClass: 'bg-yellow-500' },
    { id: 'purple', name: t('toolbar.colors.purple'), value: '#a855f7', bgClass: 'bg-purple-500' },
  ];
  const getColorClasses = (color: string, isSelected: boolean) => {
    const colorMap = {
      blue: isSelected 
        ? 'border-blue-500 bg-blue-50 text-blue-900' 
        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50',
      purple: isSelected 
        ? 'border-purple-500 bg-purple-50 text-purple-900' 
        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50',
      orange: isSelected 
        ? 'border-orange-500 bg-orange-50 text-orange-900' 
        : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="bg-white border-l border-gray-200/70 w-72 flex flex-col shadow-sm">
      {/* 工具栏标题 */}
      <div className="p-4 border-b border-gray-200/70">
        <div className="flex items-center">
          <Settings className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-base font-medium text-gray-900">{t('toolbar.title')}</h3>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {t('toolbar.subtitle')}
        </p>
      </div>

      {/* 处理方法选择 */}
      <div className="p-4 border-b border-gray-200/70">
        <h4 className="text-sm font-medium text-gray-700 mb-3">{t('toolbar.methodTitle')}</h4>
        <div className="space-y-2">
          {methods.map((method) => {
            const Icon = method.icon;
            const isSelected = redactionMethod === method.id;
            return (
              <label
                key={method.id}
                className={`
                  relative flex items-start p-3 border rounded-lg cursor-pointer transition-all duration-200
                  ${getColorClasses(method.color, isSelected)}
                `}
              >
                <input
                  type="radio"
                  name="redactionMethod"
                  value={method.id}
                  checked={isSelected}
                  onChange={() => onMethodChange(method.id)}
                  className="sr-only"
                />
                
                <div className="flex-shrink-0 mr-3">
                  <Icon className={`w-4 h-4 ${
                    isSelected 
                      ? `text-${method.color}-600` 
                      : 'text-gray-400'
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${
                      isSelected ? '' : 'text-gray-700'
                    }`}>
                      {method.name}
                    </span>
                    {method.recommended && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">
                        {t('toolbar.recommended')}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs mt-0.5 ${
                    isSelected 
                      ? `text-${method.color}-700` 
                      : 'text-gray-500'
                  }`}>
                    {method.description}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 标记颜色选择 */}
      {onColorChange && (
        <div className="p-4 border-b border-gray-200/70">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Palette className="w-4 h-4 mr-2" />
            {t('toolbar.markColor')}
          </h4>
          <div className="grid grid-cols-5 gap-2">
            {colors.map((color) => (
              <button
                key={color.id}
                onClick={() => onColorChange(color.id)}
                className={`
                  relative w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 hover:shadow-md
                  ${selectedColor === color.id 
                    ? 'border-gray-800 shadow-md' 
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}
                title={color.name}
              >
                <div className={`w-full h-full rounded-md ${color.bgClass}`} />
                {selectedColor === color.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {t('toolbar.colorDescription')}
          </p>
        </div>
      )}

      {/* 快速操作 */}
      <div className="p-4 space-y-2 flex-1">
        {/* 撤销/重做按钮 */}
        <div className="flex space-x-2 mb-3">
          <button
            onClick={onUndo}
            disabled={!canUndo || processing}
            className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title={t('toolbar.undoTooltip')}
          >
            <Undo2 className="w-4 h-4 mr-1" />
            {t('toolbar.undo')}
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo || processing}
            className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title={t('toolbar.redoTooltip')}
          >
            <Redo2 className="w-4 h-4 mr-1" />
            {t('toolbar.redo')}
          </button>
        </div>

        <button
          onClick={onPreview}
          disabled={!hasRedactions || processing}
          className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Eye className="w-4 h-4 mr-2" />
          {t('toolbar.preview')}
        </button>

        <button
          onClick={onProcess}
          disabled={!hasRedactions || processing}
          className="w-full flex items-center justify-center px-3 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {processing ? (
            <>
              <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
              {t('toolbar.processing')}
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              {t('toolbar.generatePDF')}
            </>
          )}
        </button>

        <button
          onClick={onClear}
          disabled={!hasRedactions || processing}
          className="w-full flex items-center justify-center px-3 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-600 bg-white hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {t('toolbar.clearMarks')}
        </button>
      </div>

      {/* 安全提示 */}
      <div className="p-4 border-t border-gray-200/70 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-start">
          <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="ml-2">
            <h5 className="text-xs font-medium text-blue-900 mb-1">{t('security.title')}</h5>
            <p className="text-xs text-blue-700 leading-relaxed">
              {t('security.local')} {t('security.irreversible')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

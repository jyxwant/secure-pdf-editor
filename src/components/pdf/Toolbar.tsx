import React from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Trash2, Eye, Shield, Layers, Zap, Settings, Undo2, Redo2, Palette } from 'lucide-react';

interface ToolbarProps {
  redactionMethod: 'canvas' | 'pixelate';
  onMethodChange: (method: 'canvas' | 'pixelate') => void;
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
  
  const methods = [
    {
      id: 'canvas' as const,
      name: t('toolbar.methods.canvas'),
      description: t('toolbar.methods.canvasDesc'),
      icon: Layers,
      recommended: true,
      color: 'blue'
    }
  ];
  
  const colors = [
    { id: 'red', name: t('toolbar.colors.red'), value: '#ef4444', bgClass: 'bg-red-500' },
    { id: 'blue', name: t('toolbar.colors.blue'), value: '#3b82f6', bgClass: 'bg-blue-500' },
    { id: 'green', name: t('toolbar.colors.green'), value: '#22c55e', bgClass: 'bg-green-500' },
    { id: 'yellow', name: t('toolbar.colors.yellow'), value: '#eab308', bgClass: 'bg-yellow-500' },
    { id: 'purple', name: t('toolbar.colors.purple'), value: '#a855f7', bgClass: 'bg-purple-500' },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b-2 border-black bg-yellow-50">
        <div className="flex items-center">
          <Settings className="w-5 h-5 text-black mr-2" />
          <h3 className="text-base font-black text-black uppercase">{t('toolbar.title')}</h3>
        </div>
      </div>

      {/* Methods */}
      <div className="p-4 border-b-2 border-black">
        <h4 className="text-sm font-bold text-black mb-3 uppercase tracking-wide">{t('toolbar.methodTitle')}</h4>
        <div className="space-y-3">
          {methods.map((method) => {
            const Icon = method.icon;
            const isSelected = redactionMethod === method.id;
            return (
              <label
                key={method.id}
                className={`
                  relative flex items-start p-3 border-2 cursor-pointer transition-all duration-200
                  ${isSelected 
                    ? 'border-black bg-blue-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                    : 'border-black hover:bg-gray-50'
                  }
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
                
                <div className="flex-shrink-0 mr-3 mt-1">
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-black' : 'text-gray-500'}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <span className="text-sm font-bold text-black">
                      {method.name}
                    </span>
                    {method.recommended && (
                      <span className="ml-2 px-1.5 py-0.5 text-[10px] font-black uppercase bg-green-400 text-black border border-black">
                        {t('toolbar.recommended')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-1 text-gray-700 font-medium">
                    {method.description}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Colors */}
      {onColorChange && (
        <div className="p-4 border-b-2 border-black">
          <h4 className="text-sm font-bold text-black mb-3 flex items-center uppercase tracking-wide">
            <Palette className="w-4 h-4 mr-2" />
            {t('toolbar.markColor')}
          </h4>
          <div className="grid grid-cols-5 gap-2">
            {colors.map((color) => (
              <button
                key={color.id}
                onClick={() => onColorChange(color.id)}
                className={`
                  relative w-10 h-10 border-2 transition-all duration-200
                  ${selectedColor === color.id 
                    ? 'border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] scale-110 z-10' 
                    : 'border-black hover:scale-105'
                  }
                `}
                title={color.name}
              >
                <div className={`w-full h-full ${color.bgClass}`} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-4 space-y-3 flex-1 overflow-y-auto">
        <div className="flex space-x-2">
          <button
            onClick={onUndo}
            disabled={!canUndo || processing}
            className="flex-1 neo-btn-sm bg-white hover:bg-gray-100 flex justify-center items-center disabled:opacity-50"
            title={t('toolbar.undoTooltip')}
          >
            <Undo2 className="w-4 h-4 mr-1" />
            {t('toolbar.undo')}
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo || processing}
            className="flex-1 neo-btn-sm bg-white hover:bg-gray-100 flex justify-center items-center disabled:opacity-50"
            title={t('toolbar.redoTooltip')}
          >
            <Redo2 className="w-4 h-4 mr-1" />
            {t('toolbar.redo')}
          </button>
        </div>

        <button
          onClick={onPreview}
          disabled={!hasRedactions || processing}
          className="w-full neo-btn bg-white hover:bg-yellow-200 flex justify-center items-center disabled:opacity-50 disabled:shadow-none disabled:translate-x-1 disabled:translate-y-1"
        >
          <Eye className="w-4 h-4 mr-2" />
          {t('toolbar.preview')}
        </button>

        <button
          onClick={onProcess}
          disabled={!hasRedactions || processing}
          className="w-full neo-btn bg-blue-600 text-white hover:bg-blue-500 flex justify-center items-center disabled:opacity-50 disabled:shadow-none disabled:translate-x-1 disabled:translate-y-1"
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
          className="w-full neo-btn bg-red-500 text-white hover:bg-red-400 flex justify-center items-center disabled:opacity-50 disabled:shadow-none disabled:translate-x-1 disabled:translate-y-1"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {t('toolbar.clearMarks')}
        </button>
      </div>

      {/* Security Badge */}
      <div className="p-4 border-t-2 border-black bg-blue-50">
        <div className="flex items-start">
          <Shield className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
          <div className="ml-2">
            <h5 className="text-xs font-black text-black uppercase mb-1">Local Processing</h5>
            <p className="text-xs text-gray-800 font-medium leading-relaxed">
              Files never leave your device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

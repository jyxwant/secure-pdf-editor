import React from 'react';
import { useTranslation } from 'react-i18next';

export const I18nTest: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  const testKeys = [
    'app.title',
    'upload.title', 
    'upload.fileRequirements.title',
    'upload.fileRequirements.format',
    'upload.usageFlow.title',
    'upload.usageFlow.step1',
    'fileUploader.dragDrop.title',
    'fileUploader.dragDrop.clickToSelect',
    'fileUploader.maxSize',
    'fileUploader.pdfOnly',
    'fileUploader.localProcessing',
    'security.localProcessing',
    'security.description'
  ];
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>i18n Debug Page</h1>
      <p>Current language: <strong>{i18n.language}</strong></p>
      
      <div style={{ margin: '20px 0' }}>
        <button onClick={() => i18n.changeLanguage('en')} style={{ margin: '5px', padding: '10px' }}>
          English
        </button>
        <button onClick={() => i18n.changeLanguage('fr')} style={{ margin: '5px', padding: '10px' }}>
          Français
        </button>
        <button onClick={() => i18n.changeLanguage('ar')} style={{ margin: '5px', padding: '10px' }}>
          العربية
        </button>
      </div>
      
      <h2>Translation Test Results:</h2>
      <table style={{ border: '1px solid #ccc', borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Key</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Translation</th>
          </tr>
        </thead>
        <tbody>
          {testKeys.map(key => (
            <tr key={key}>
              <td style={{ border: '1px solid #ccc', padding: '8px', fontFamily: 'monospace' }}>
                {key}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {t(key)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <h2>Raw Translations Debug:</h2>
      <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', fontSize: '12px', overflow: 'auto' }}>
        {JSON.stringify(i18n.getResourceBundle(i18n.language, 'translation'), null, 2).substring(0, 1000)}...
      </pre>
    </div>
  );
};
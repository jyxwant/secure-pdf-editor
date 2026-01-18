import React from 'react';

const LegalWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-[#f0f0f0] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Title Card */}
        <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 mb-8 text-center">
          <h1 className="text-4xl font-black text-black uppercase tracking-tight m-0">{title}</h1>
        </div>
        
        {/* Content Card */}
        <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 sm:p-12">
          <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-black prose-p:text-gray-800 prose-p:font-medium prose-li:text-gray-800 prose-strong:text-black">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalWrapper;

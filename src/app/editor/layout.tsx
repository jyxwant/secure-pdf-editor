import type { Metadata } from 'next';
import MarketingLayout from '@/components/MarketingLayout';

export const metadata: Metadata = {
  title: 'PDF Editor - Redact Sensitive Data | SecureRedact',
  description: 'Securely redact your PDF files locally. No server uploads.',
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MarketingLayout>
      {children}
    </MarketingLayout>
  );
}

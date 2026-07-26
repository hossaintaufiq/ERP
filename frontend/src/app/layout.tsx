import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProviders } from '@/lib/providers';

export const metadata: Metadata = {
  title: 'Garments ERP — Enterprise Manufacturing Platform',
  description:
    'Production-grade garments ERP: merchandising, BOM, production, QC, payroll, shipment, finance, and AI assistant.',
  appleWebApp: {
    capable: true,
    title: 'Garments ERP',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f1f4f8' },
    { media: '(prefers-color-scheme: dark)', color: '#0b111c' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-brand-600/20 selection:text-inherit">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

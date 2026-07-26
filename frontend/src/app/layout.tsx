import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/lib/providers';

export const metadata: Metadata = {
  title: 'Garments ERP — Enterprise Manufacturing Platform',
  description:
    'Production-grade garments ERP: merchandising, BOM, production, QC, payroll, shipment, finance, and AI assistant.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-brand-500/25 selection:text-inherit">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

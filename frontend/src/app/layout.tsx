import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Garments ERP - Garment & Textile Enterprise',
  description: 'Comprehensive 20-module ERP solution for apparel & garment manufacturing, BOM calculation, shop floor telemetry, buyer portal, and biometric payroll.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-brand-500/25 selection:text-inherit">
        {children}
      </body>
    </html>
  );
}

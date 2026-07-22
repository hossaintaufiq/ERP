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
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

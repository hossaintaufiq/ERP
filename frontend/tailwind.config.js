/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#e0e9fe',
          200: '#bae0fd',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#0f172a',
        },
        garment: {
          cutting: '#ec4899',
          printing: '#8b5cf6',
          embroidery: '#a855f7',
          sewing: '#3b82f6',
          washing: '#06b6d4',
          ironing: '#10b981',
          packing: '#f59e0b',
          shipment: '#6366f1',
        }
      },
    },
  },
  plugins: [],
}

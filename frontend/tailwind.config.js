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
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f0f9fa',
          100: '#d9f1f3',
          200: '#b7e3e8',
          300: '#85ced6',
          400: '#4fafbc',
          500: '#3493a1',
          600: '#2d7788',
          700: '#2a6170',
          800: '#29505d',
          900: '#264450',
          950: '#142c35',
        },
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          muted: 'rgb(var(--surface-muted) / <alpha-value>)',
          raised: 'rgb(var(--surface-raised) / <alpha-value>)',
        },
        garment: {
          cutting: '#db2777',
          printing: '#7c3aed',
          embroidery: '#9333ea',
          sewing: '#2563eb',
          washing: '#0891b2',
          ironing: '#059669',
          packing: '#d97706',
          shipment: '#4f46e5',
        },
      },
      boxShadow: {
        panel: '0 1px 2px rgb(15 23 42 / 0.04), 0 8px 24px rgb(15 23 42 / 0.04)',
        'panel-dark': '0 1px 2px rgb(0 0 0 / 0.2), 0 8px 24px rgb(0 0 0 / 0.25)',
        focus: '0 0 0 3px rgb(45 119 136 / 0.28)',
      },
      borderRadius: {
        panel: '0.875rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.35s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

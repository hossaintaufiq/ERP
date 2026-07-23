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
        /* Muted steel — single primary accent, no loud blues */
        brand: {
          50: '#f6f7f8',
          100: '#eceef0',
          200: '#d5d9de',
          300: '#b0b8c0',
          400: '#88939e',
          500: '#6b7784',
          600: '#556270',
          700: '#454f5c',
          800: '#3a424d',
          900: '#323840',
          950: '#1f2429',
        },
        /* Warm neutrals for premium surfaces */
        canvas: {
          DEFAULT: '#f5f4f1',
          dark: '#111113',
        },
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          muted: 'rgb(var(--surface-muted) / <alpha-value>)',
          raised: 'rgb(var(--surface-raised) / <alpha-value>)',
        },
        /* Desaturated production stage colors */
        garment: {
          cutting: '#9d6b7a',
          printing: '#7a6b8f',
          embroidery: '#85708f',
          sewing: '#5c6d82',
          washing: '#5a7a82',
          ironing: '#5c7a6e',
          packing: '#8a7355',
          shipment: '#636878',
        },
        status: {
          success: '#5c7268',
          warning: '#8a7355',
          danger: '#8b6565',
          info: '#5c6d82',
        },
      },
      boxShadow: {
        panel: '0 1px 2px rgb(28 25 23 / 0.04), 0 4px 16px rgb(28 25 23 / 0.03)',
        'panel-dark': '0 1px 2px rgb(0 0 0 / 0.25), 0 4px 20px rgb(0 0 0 / 0.2)',
        focus: '0 0 0 3px rgb(69 79 92 / 0.22)',
      },
      borderRadius: {
        panel: '0.75rem',
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

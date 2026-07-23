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
        /* Deep teal — premium, alive, not flashy */
        brand: {
          50: '#f0fafa',
          100: '#d5f1f1',
          200: '#abe3e4',
          300: '#74cbd0',
          400: '#3faab3',
          500: '#268f99',
          600: '#1d727c',
          700: '#1c5c65',
          800: '#1c4b53',
          900: '#1b4046',
          950: '#0a272c',
        },
        canvas: {
          DEFAULT: '#f7f6f3',
          dark: '#0c0f12',
        },
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          muted: 'rgb(var(--surface-muted) / <alpha-value>)',
          raised: 'rgb(var(--surface-raised) / <alpha-value>)',
        },
        garment: {
          cutting: '#c45d7a',
          printing: '#7c6aad',
          embroidery: '#8b6bb0',
          sewing: '#3d7ea6',
          washing: '#2a9aad',
          ironing: '#3d9a7a',
          packing: '#c48a3d',
          shipment: '#5b6db5',
        },
        status: {
          success: '#1f8a6a',
          warning: '#c4841d',
          danger: '#c45050',
          info: '#2f7ea8',
        },
      },
      boxShadow: {
        panel: '0 1px 2px rgb(28 25 23 / 0.05), 0 8px 24px rgb(28 25 23 / 0.05)',
        'panel-dark': '0 1px 2px rgb(0 0 0 / 0.3), 0 8px 28px rgb(0 0 0 / 0.35)',
        focus: '0 0 0 3px rgb(38 143 153 / 0.28)',
        glow: '0 4px 20px rgb(38 143 153 / 0.22)',
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

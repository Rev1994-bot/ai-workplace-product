/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d4d8e0',
          300: '#aab2c0',
          400: '#7a8499',
          500: '#525e75',
          600: '#3a4458',
          700: '#2a3245',
          800: '#1d2433',
          900: '#131826',
          950: '#0a0e18',
        },
        brand: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#bcd2ff',
          300: '#8eb4ff',
          400: '#5a8bff',
          500: '#3563ff',
          600: '#1d44f5',
          700: '#1633e1',
          800: '#182db6',
          900: '#1a2d8f',
          950: '#141d57',
        },
        accent: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a6f4cf',
          300: '#6ee7b3',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        warn: {
          50: '#fffbeb',
          100: '#fef3c7',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgba(16,24,40,0.04), 0 1px 3px 0 rgba(16,24,40,0.06)',
        card: '0 1px 2px 0 rgba(16,24,40,0.04), 0 4px 12px -2px rgba(16,24,40,0.08)',
        pop: '0 10px 30px -8px rgba(16,24,40,0.18)',
        glow: '0 0 0 1px rgba(53,99,255,0.15), 0 8px 24px -6px rgba(53,99,255,0.25)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'blink-caret': {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        shimmer: 'shimmer 1.6s infinite',
        'pulse-soft': 'pulse-soft 1.4s ease-in-out infinite',
        'blink-caret': 'blink-caret 1s steps(2) infinite',
      },
    },
  },
  plugins: [],
};

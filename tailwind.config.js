/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0f7f4',
          100: '#dbf0e6',
          200: '#b9e0cf',
          300: '#8ac9b0',
          400: '#54ab8b',
          500: '#2f8e6e',
          600: '#1f7258',
          700: '#1a5b48',
          800: '#16493a',
          900: '#103b30',
          950: '#08251f',
        },
        navy: {
          50: '#f2f5f9',
          100: '#e3eaf2',
          200: '#c9d6e6',
          300: '#9fb5cf',
          400: '#6e8db4',
          500: '#4d6f99',
          600: '#3c587e',
          700: '#324964',
          800: '#2c3f54',
          900: '#1f2d3d',
          950: '#141d29',
        },
        emerald: {
          accent: '#10b981',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(16, 59, 48, 0.04), 0 1px 3px 0 rgba(16, 59, 48, 0.06)',
        'card-hover': '0 4px 12px -2px rgba(16, 59, 48, 0.10), 0 2px 6px -2px rgba(16, 59, 48, 0.08)',
        elevated: '0 12px 32px -8px rgba(16, 59, 48, 0.18), 0 4px 12px -4px rgba(16, 59, 48, 0.10)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'pulse-soft': 'pulse-soft 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

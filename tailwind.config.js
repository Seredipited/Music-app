/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74',
          400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c',
          800: '#9a3412', 900: '#7c2d12', 950: '#431407',
        },
        warm: {
          50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047',
          400: '#facc15', 500: '#eab308', 600: '#ca8a04', 700: '#a16207',
          800: '#854d0e', 900: '#713f12', 950: '#422006',
        },
        earth: {
          50: '#faf5f0', 100: '#f5ebe0', 200: '#e8ddd0', 300: '#d4c4b0',
          400: '#c4a882', 500: '#b8956f', 600: '#a67c52', 700: '#8b6441',
          800: '#725338', 900: '#5d452e', 950: '#3d2b1e',
        },
        dark: {
          50: '#faf9f7', 100: '#f5f0eb', 200: '#e8ddd0', 300: '#d4c4b0',
          400: '#a89a85', 500: '#8b7a65', 600: '#5c4d3d', 700: '#3d3228',
          800: '#2a2118', 900: '#1a1510', 950: '#0f0c08',
        },
        // 深蓝渐变色系 — 用于 gradient-bg
        deep: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#3730a3',
          800: '#1e1b4b',
          900: '#13102e',
          950: '#0b0821',
        },
        // 唱片/黑胶相关色
        vinyl: {
          light: '#2a2a3a',
          DEFAULT: '#1a1a2e',
          dark: '#0f0f1a',
        }
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'spin-slower': 'spin 8s linear infinite',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'pulse-glow-slow': 'pulse-glow 3.5s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out both',
        'slide-up-d1': 'slide-up 0.5s ease-out 0.05s both',
        'slide-up-d2': 'slide-up 0.5s ease-out 0.1s both',
        'slide-up-d3': 'slide-up 0.5s ease-out 0.15s both',
        'slide-up-d4': 'slide-up 0.5s ease-out 0.2s both',
        'slide-up-d5': 'slide-up 0.5s ease-out 0.25s both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'fade-in-d1': 'fade-in 0.4s ease-out 0.1s both',
        'fade-in-d2': 'fade-in 0.4s ease-out 0.2s both',
        'fade-in-d3': 'fade-in 0.4s ease-out 0.3s both',
        'float': 'float 4s ease-in-out infinite',
        'breathe': 'breathe 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 30px rgba(99, 102, 241, 0.3), 0 0 60px rgba(99, 102, 241, 0.1)' },
          '50%': { boxShadow: '0 0 50px rgba(99, 102, 241, 0.5), 0 0 100px rgba(99, 102, 241, 0.25)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'breathe': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

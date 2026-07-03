/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 新主色体系：靛蓝 #818cf8
        primary: {
          50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc',
          400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca',
          800: '#3730a3', 900: '#312e81', 950: '#1e1b4b',
        },
        // 表面色系
        surface: {
          DEFAULT: '#161d31',
          50: '#283352',
          100: '#232d49',
          200: '#1e2746',
          300: '#1a223d',
          400: '#161d31',
          500: '#131b2c',
          600: '#101827',
          700: '#2d3a5c',
          800: '#38476e',
          900: '#94a3b8',
        },
        // 文字色系
        ink: {
          DEFAULT: '#ffffff',
          secondary: '#94a3b8',
          muted: '#64748b',
        },
        // 保留管理后台色系（earth + admin 别名）
        admin: {
          50: '#faf5f0', 100: '#f5ebe0', 200: '#e8ddd0', 300: '#d4c4b0',
          400: '#c4a882', 500: '#b8956f', 600: '#a67c52', 700: '#8b6441',
          800: '#725338', 900: '#5d452e', 950: '#3d2b1e',
        },
        earth: {
          50: '#faf5f0', 100: '#f5ebe0', 200: '#e8ddd0', 300: '#d4c4b0',
          400: '#c4a882', 500: '#b8956f', 600: '#a67c52', 700: '#8b6441',
          800: '#725338', 900: '#5d452e', 950: '#3d2b1e',
        },
        // 保留深色系用于向后兼容
        deep: {
          50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc',
          400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#3730a3',
          800: '#1e1b4b', 900: '#13102e', 950: '#0b0821',
        },
        vinyl: {
          light: '#2a2a3a',
          DEFAULT: '#1a1a2e',
          dark: '#0f0f1a',
        }
      },
      animation: {
        'spin-slow': 'spin 4s linear infinite',
        'spin-slower': 'spin 8s linear infinite',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'pulse-glow-slow': 'pulse-glow 3.5s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'float': 'float 4s ease-in-out infinite',
        'card-lift': 'card-lift 0.3s ease-out forwards',
        'vinyl-glow': 'vinyl-glow 3s ease-in-out infinite',
        'slide-in-up': 'slide-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in-up-d1': 'slide-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both',
        'slide-in-up-d2': 'slide-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both',
        'slide-in-up-d3': 'slide-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both',
        'slide-in-up-d4': 'slide-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both',
        'slide-in-up-d5': 'slide-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both',
        'slide-in-up-d6': 'slide-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 30px rgba(129, 140, 248, 0.3), 0 0 60px rgba(129, 140, 248, 0.1)' },
          '50%': { boxShadow: '0 0 60px rgba(129, 140, 248, 0.5), 0 0 120px rgba(129, 140, 248, 0.25)' },
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
        'card-lift': {
          '0%': { transform: 'translateY(0)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
          '100%': { transform: 'translateY(-8px)', boxShadow: '0 16px 32px rgba(129,140,248,0.2)' },
        },
        'vinyl-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 40px rgba(129,140,248,0.3), 0 0 80px rgba(129,140,248,0.15), 0 0 120px rgba(129,140,248,0.05)',
            transform: 'scale(1)',
          },
          '50%': { 
            boxShadow: '0 0 60px rgba(129,140,248,0.5), 0 0 120px rgba(129,140,248,0.3), 0 0 180px rgba(129,140,248,0.1)',
            transform: 'scale(1.02)',
          },
        },
        'slide-in-up': {
          '0%': { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: {
      // 将前端 /api 请求代理到后端 Express 服务 (8080)
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})

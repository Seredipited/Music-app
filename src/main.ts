import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { registerRefreshHandler } from './lib/api'
import { useAuthStore } from './stores/auth'
import './index.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// pinia 初始化后注册 token 刷新处理器，使 API 层能在 401 时自动刷新
const authStore = useAuthStore()
registerRefreshHandler(() => authStore.refresh())

app.use(router)
app.mount('#app')

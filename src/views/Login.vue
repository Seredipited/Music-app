<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Music2, Lock, User, ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const errorMsg = ref('')
const isLoading = ref(false)

async function handleLogin() {
  if (!username.value.trim() || !password.value.trim()) {
    errorMsg.value = '请输入用户名和密码'
    return
  }

  errorMsg.value = ''
  isLoading.value = true

  try {
    const success = await authStore.login(username.value.trim(), password.value.trim())
    if (success) {
      if (authStore.isAdmin) {
        const redirect = route.query.redirect as string || '/admin'
        router.push(redirect)
      } else {
        router.push('/')
      }
    } else {
      errorMsg.value = '用户名或密码错误'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4" style="background-color: #161d31;">
    <div class="w-full max-w-md bg-surface-200/60 border border-white/5 rounded-2xl p-8 backdrop-blur-xl">
      <div class="flex flex-col items-center mb-8">
        <div class="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-lg shadow-primary-500/25">
          <Music2 class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-2xl font-bold text-white">管理员登录</h1>
        <p class="text-ink-secondary text-sm mt-2">音乐管理系统</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm text-ink-secondary mb-1.5">用户名</label>
          <div class="relative">
            <User class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
            <input
              v-model="username"
              type="text"
              placeholder="请输入用户名"
              class="w-full pl-10 pr-4 py-2.5 bg-surface-400/50 border border-white/5 rounded-xl text-white focus:outline-none focus:border-primary-400/40 focus:bg-surface-300/50 transition-colors placeholder:text-ink-muted/40"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm text-ink-secondary mb-1.5">密码</label>
          <div class="relative">
            <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
            <input
              v-model="password"
              type="password"
              placeholder="请输入密码"
              class="w-full pl-10 pr-4 py-2.5 bg-surface-400/50 border border-white/5 rounded-xl text-white focus:outline-none focus:border-primary-400/40 focus:bg-surface-300/50 transition-colors placeholder:text-ink-muted/40"
            />
          </div>
        </div>

        <p v-if="errorMsg" class="text-rose-400 text-sm">{{ errorMsg }}</p>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-2.5 gradient-primary rounded-xl text-white font-medium hover:shadow-lg hover:shadow-primary-500/30 transition-all disabled:opacity-60"
        >
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
      </form>

      <!-- 默认账号提示 -->
      <div class="mt-5 p-3 rounded-xl bg-primary-500/10 border border-primary-400/20 text-center">
        <p class="text-primary-300 text-xs font-medium mb-1">🔑 默认管理员账号</p>
        <p class="text-white/80 text-sm">
          用户名：<span class="text-primary-300 font-semibold">admin</span>&nbsp;&nbsp;&nbsp;
          密码：<span class="text-primary-300 font-semibold">112233</span>
        </p>
      </div>

      <div class="mt-4 text-center">
        <RouterLink to="/" class="inline-flex items-center gap-1.5 text-sm text-ink-secondary hover:text-primary-300 transition-colors">
          <ArrowLeft class="w-3.5 h-3.5" />
          返回前端首页
        </RouterLink>
      </div>
    </div>
  </div>
</template>

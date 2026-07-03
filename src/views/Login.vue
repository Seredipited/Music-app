<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Music2, Lock, User } from 'lucide-vue-next'

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
  <div class="min-h-screen flex items-center justify-center bg-[#121212] px-4">
    <div class="w-full max-w-md bg-earth-800/50 border border-earth-700/50 rounded-2xl p-8">
      <div class="flex flex-col items-center mb-8">
        <div class="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mb-4">
          <Music2 class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-2xl font-bold text-earth-100">管理员登录</h1>
        <p class="text-earth-400 text-sm mt-2">音乐管理系统</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm text-earth-300 mb-1.5">用户名</label>
          <div class="relative">
            <User class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-500" />
            <input
              v-model="username"
              type="text"
              placeholder="请输入用户名"
              class="w-full pl-10 pr-4 py-2.5 bg-earth-900/50 border border-earth-700/50 rounded-xl text-earth-100 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm text-earth-300 mb-1.5">密码</label>
          <div class="relative">
            <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-500" />
            <input
              v-model="password"
              type="password"
              placeholder="请输入密码"
              class="w-full pl-10 pr-4 py-2.5 bg-earth-900/50 border border-earth-700/50 rounded-xl text-earth-100 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        <p v-if="errorMsg" class="text-red-400 text-sm">{{ errorMsg }}</p>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-2.5 gradient-primary rounded-xl text-white font-medium hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-60"
        >
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <RouterLink to="/" class="text-sm text-earth-400 hover:text-primary transition-colors">
          返回前端首页
        </RouterLink>
      </div>
    </div>
  </div>
</template>

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginApi, refreshTokenApi } from '@/lib/api'

export const useAuthStore = defineStore('auth', () => {
  const isAdmin = ref(false)
  const username = ref('')
  const token = ref('')
  const refreshToken = ref('')

  // 从 localStorage 恢复状态
  const savedAuth = localStorage.getItem('music_auth')
  if (savedAuth) {
    try {
      const parsed = JSON.parse(savedAuth)
      isAdmin.value = parsed.isAdmin || false
      username.value = parsed.username || ''
      token.value = parsed.token || ''
      refreshToken.value = parsed.refreshToken || ''
    } catch {
      localStorage.removeItem('music_auth')
    }
  }

  function saveAuth() {
    localStorage.setItem('music_auth', JSON.stringify({
      isAdmin: isAdmin.value,
      username: username.value,
      token: token.value,
      refreshToken: refreshToken.value
    }))
  }

  async function login(user: string, pass: string): Promise<boolean> {
    try {
      const result = await loginApi(user, pass)
      if (result.role === 'admin') {
        isAdmin.value = true
        username.value = result.username
        token.value = result.token
        refreshToken.value = result.refreshToken
        saveAuth()
        return true
      }
      return false
    } catch {
      return false
    }
  }

  // 尝试刷新 accessToken
  async function refresh(): Promise<boolean> {
    if (!refreshToken.value) return false
    try {
      const result = await refreshTokenApi(refreshToken.value)
      token.value = result.token
      saveAuth()
      return true
    } catch {
      logout()
      return false
    }
  }

  function logout() {
    isAdmin.value = false
    username.value = ''
    token.value = ''
    refreshToken.value = ''
    localStorage.removeItem('music_auth')
  }

  return { isAdmin, username, token, refreshToken, login, refresh, logout }
})

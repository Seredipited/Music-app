import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type UserRole = 'admin' | 'user'

export interface AuthState {
  isAuthenticated: boolean
  role: UserRole | null
  username: string
}

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const role = ref<UserRole | null>(null)
  const username = ref('')

  const isAdmin = computed(() => isAuthenticated.value && role.value === 'admin')

  function saveSession() {
    const data: AuthState = {
      isAuthenticated: isAuthenticated.value,
      role: role.value,
      username: username.value
    }
    localStorage.setItem('music_auth', JSON.stringify(data))
  }

  function restoreSession() {
    const saved = localStorage.getItem('music_auth')
    if (!saved) return
    try {
      const data: AuthState = JSON.parse(saved)
      isAuthenticated.value = data.isAuthenticated
      role.value = data.role
      username.value = data.username
    } catch {
      localStorage.removeItem('music_auth')
    }
  }

  async function login(user: string, pass: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300))

    if (user === 'admin' && pass === 'admin') {
      isAuthenticated.value = true
      role.value = 'admin'
      username.value = user
      saveSession()
      return true
    }

    if (user && pass) {
      isAuthenticated.value = true
      role.value = 'user'
      username.value = user
      saveSession()
      return true
    }

    return false
  }

  function logout() {
    isAuthenticated.value = false
    role.value = null
    username.value = ''
    localStorage.removeItem('music_auth')
  }

  restoreSession()

  return {
    isAuthenticated,
    role,
    username,
    isAdmin,
    login,
    logout
  }
})

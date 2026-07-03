<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '@/components/layout/Sidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { User, LogOut, Monitor } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isAdminRoute = computed(() => route.path.startsWith('/admin'))
const isLoginRoute = computed(() => route.path === '/login')

const activeMenu = ref('songs')
const showUserDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const routeToMenuMap: Record<string, string> = {
  '/admin/songs': 'songs',
  '/admin/genres': 'genres',
  '/admin/tags': 'tags',
  '/admin/artists': 'artists',
  '/admin/albums': 'albums',
  '/admin/stats': 'stats'
}

watch(() => route.path, (path) => {
  activeMenu.value = routeToMenuMap[path] || 'songs'
}, { immediate: true })

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showUserDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function handleLogout() {
  authStore.logout()
  showUserDropdown.value = false
  router.push('/login')
}

function handleGoToFrontend() {
  showUserDropdown.value = false
  router.push('/')
}
</script>

<template>
  <!-- Admin Layout -->
  <template v-if="isAdminRoute">
    <div class="flex h-screen bg-[#f5f5f5]">
      <Sidebar v-model:activeMenu="activeMenu" />
      <div class="flex-1 flex flex-col min-h-0 overflow-hidden">
        <header class="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-end shrink-0">
          <div ref="dropdownRef" class="relative">
            <button
              @click.stop="showUserDropdown = !showUserDropdown"
              class="flex items-center gap-1.5 text-sm text-[#606266] hover:text-[#409eff] transition-colors cursor-pointer"
            >
              <User class="w-4 h-4" />
              管理员
            </button>
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-1"
            >
              <div
                v-if="showUserDropdown"
                class="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
              >
                <button
                  @click="handleGoToFrontend"
                  class="w-full px-4 py-2.5 text-sm text-left text-[#606266] hover:bg-gray-50 flex items-center gap-2 transition-colors"
                >
                  <Monitor class="w-4 h-4" />
                  返回前端界面
                </button>
                <button
                  @click="handleLogout"
                  class="w-full px-4 py-2.5 text-sm text-left text-[#606266] hover:bg-gray-50 flex items-center gap-2 transition-colors"
                >
                  <LogOut class="w-4 h-4" />
                  退出登录
                </button>
              </div>
            </Transition>
          </div>
        </header>
        <main class="flex-1 min-h-0 overflow-auto">
          <RouterView />
        </main>
        <AppFooter />
      </div>
    </div>
  </template>

  <!-- Login Page — fullscreen standalone -->
  <template v-else-if="isLoginRoute">
    <div class="h-screen">
      <RouterView />
    </div>
  </template>

  <!-- Frontend Layout — 经典三栏弹性布局 -->
  <template v-else>
    <div class="h-screen flex flex-col gradient-bg">
      <AppHeader />
      <main class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <RouterView />
      </main>
      <AppFooter />
    </div>
  </template>
</template>

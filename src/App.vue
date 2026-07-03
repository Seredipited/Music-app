<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '@/components/layout/Sidebar.vue'
import SideNav from '@/components/layout/SideNav.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { User, LogOut, Monitor } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { usePlayerStore } from '@/stores/player'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const playerStore = usePlayerStore()

const isAdminRoute = computed(() => route.path.startsWith('/admin'))
const isLoginRoute = computed(() => route.path === '/login')

const activeMenu = ref('songs')
const showUserDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

// 全局音频元素
const audioRef = ref<HTMLAudioElement | null>(null)

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

// 音频事件处理
function handleTimeUpdate() {
  if (audioRef.value) {
    playerStore.setProgress(audioRef.value.currentTime)
  }
}

function handleLoadedMetadata() {
  if (audioRef.value && isFinite(audioRef.value.duration)) {
    playerStore.setDuration(audioRef.value.duration)
  }
}

function handleAudioEnded() {
  playerStore.playNext()
}

function handleAudioError() {
  console.warn('音频加载失败:', playerStore.currentSong?.audio)
}

// 注册音频元素到 player store
onMounted(() => {
  if (audioRef.value) {
    playerStore.registerAudio(audioRef.value)
  }
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  playerStore.unregisterAudio()
  document.removeEventListener('click', handleClickOutside)
})

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showUserDropdown.value = false
  }
}

function handleLogout() {
  authStore.logout()
  showUserDropdown.value = false
  router.push('/login')
}

function handleGoToFrontend() {
  showUserDropdown.value = false
  router.push('/')
}

// 进度条拖拽
function handleSeek(event: MouseEvent) {
  if (!audioRef.value) return
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  const time = percent * playerStore.duration
  audioRef.value.currentTime = time
  playerStore.setProgress(time)
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
        <AppFooter @seek="handleSeek" />
      </div>
    </div>
  </template>

  <!-- Login Page -->
  <template v-else-if="isLoginRoute">
    <div class="h-screen">
      <RouterView />
    </div>
  </template>

  <!-- Frontend Layout — 侧边栏 + 顶部导航 + 内容区 + 底部播放栏 -->
  <template v-else>
    <div class="h-screen flex flex-col">
      <div class="flex flex-1 min-h-0">
        <!-- 左侧固定侧边栏 -->
        <SideNav />
        
        <!-- 右侧内容区 -->
        <div class="flex-1 flex flex-col min-h-0 min-w-0">
          <AppHeader />
          <main class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
            <RouterView />
          </main>
        </div>
      </div>
      
      <!-- 底部播放栏 — 悬浮毛玻璃 -->
      <AppFooter @seek="handleSeek" />
    </div>

    <!-- 全局音频元素 -->
    <audio
      ref="audioRef"
      @timeupdate="handleTimeUpdate"
      @loadedmetadata="handleLoadedMetadata"
      @ended="handleAudioEnded"
      @error="handleAudioError"
      @play="() => { if (!playerStore.isPlaying) playerStore.togglePlay() }"
      @pause="() => { if (playerStore.isPlaying) playerStore.togglePlay() }"
    ></audio>
  </template>
</template>

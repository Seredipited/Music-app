<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { searchMusic } from '@/stores/data'
import { Search, Play, Clock, Music2, Loader2, X } from 'lucide-vue-next'
import type { Song } from '@/stores/types'

const route = useRoute()
const router = useRouter()
const playerStore = usePlayerStore()

const searchQuery = ref('')
const isSearching = ref(false)
const searchResults = ref<Song[]>([])
const hasSearched = ref(false)

watch(() => route.query.q, (newQuery) => {
  if (newQuery) {
    searchQuery.value = newQuery as string
    performSearch()
  }
}, { immediate: true })

onMounted(() => {
  if (route.query.q) {
    searchQuery.value = route.query.q as string
    performSearch()
  }
})

async function performSearch() {
  if (!searchQuery.value.trim()) return
  
  isSearching.value = true
  hasSearched.value = true
  
  try {
    const result = await searchMusic(searchQuery.value)
    searchResults.value = result.songs
  } finally {
    isSearching.value = false
  }
}

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value } })
  }
}

function playSong(song: Song) {
  playerStore.setCurrentSong(song, searchResults.value)
}

function clearSearch() {
  searchQuery.value = ''
  searchResults.value = []
  hasSearched.value = false
  router.push({ path: '/search' })
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="px-6 lg:px-10 py-8">
    <!-- 搜索头部 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-6 text-white">搜索音乐</h1>
      <form @submit.prevent="handleSearch" class="relative max-w-2xl">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="输入歌名、歌手或专辑名称..."
          class="w-full pl-12 pr-12 py-3.5 bg-surface-200/50 border border-white/5 rounded-2xl text-lg text-white focus:outline-none focus:border-primary-400/40 focus:bg-surface-100/50 transition-all placeholder:text-ink-muted/50"
        />
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted" />
        <button
          v-if="searchQuery"
          type="button"
          @click="clearSearch"
          class="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/5 rounded-full"
        >
          <X class="w-5 h-5 text-ink-muted" />
        </button>
      </form>
    </div>

    <!-- 加载中 -->
    <div v-if="isSearching" class="flex flex-col items-center justify-center py-20">
      <Loader2 class="w-12 h-12 text-primary-400 animate-spin mb-4" />
      <p class="text-ink-secondary">正在搜索...</p>
    </div>

    <!-- 搜索结果 -->
    <div v-else-if="hasSearched && searchResults.length > 0">
      <div class="flex items-center justify-between mb-6">
        <p class="text-ink-secondary">
          找到 <span class="text-primary-300 font-semibold">{{ searchResults.length }}</span> 首相关歌曲
        </p>
      </div>
      
      <div class="bg-surface-200/40 rounded-2xl overflow-hidden border border-white/5">
        <div class="grid grid-cols-12 gap-4 px-4 py-3 text-sm text-ink-muted border-b border-white/5">
          <div class="col-span-1">#</div>
          <div class="col-span-5 sm:col-span-4">歌曲</div>
          <div class="col-span-3 hidden sm:block">歌手</div>
          <div class="col-span-2 hidden md:block">专辑</div>
          <div class="col-span-1 flex justify-end">
            <Clock class="w-4 h-4" />
          </div>
        </div>
        <div
          v-for="(song, index) in searchResults"
          :key="song.id"
          @click="playSong(song)"
          class="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-white/[0.03] cursor-pointer transition-colors group"
          :class="{ 'bg-primary-500/8': playerStore.currentSong?.id === song.id }"
        >
          <div class="col-span-1">
            <span v-if="playerStore.currentSong?.id !== song.id" class="text-ink-muted group-hover:hidden">
              {{ index + 1 }}
            </span>
            <Play v-if="playerStore.currentSong?.id === song.id && playerStore.isPlaying" class="w-4 h-4 text-primary-400" fill="currentColor" />
            <Play v-else class="w-4 h-4 hidden group-hover:block text-ink-secondary" />
          </div>
          <div class="col-span-5 sm:col-span-4 flex items-center gap-3">
            <div class="cover-mask w-10 h-10 rounded-lg overflow-hidden shrink-0">
              <img :src="song.cover" :alt="song.name" class="w-full h-full object-cover" />
            </div>
            <div class="min-w-0 text-left">
              <p class="text-base font-medium truncate" :class="{ 'text-primary-300': playerStore.currentSong?.id === song.id, 'text-white/90': playerStore.currentSong?.id !== song.id }">
                {{ song.name }}
              </p>
              <p class="text-sm text-ink-secondary truncate sm:hidden">{{ song.artist }}</p>
            </div>
          </div>
          <div class="col-span-3 hidden sm:block">
            <p class="text-sm text-ink-secondary truncate group-hover:text-white/70">{{ song.artist }}</p>
          </div>
          <div class="col-span-2 hidden md:block">
            <p class="text-sm text-ink-muted truncate">{{ song.album }}</p>
          </div>
          <div class="col-span-1 flex justify-end">
            <span class="text-sm text-ink-muted">{{ formatTime(song.duration) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 无结果 -->
    <div v-else-if="hasSearched && searchResults.length === 0" class="flex flex-col items-center justify-center py-20">
      <Music2 class="w-16 h-16 text-ink-muted/20 mb-4" />
      <h3 class="text-xl font-semibold mb-2 text-white">未找到相关歌曲</h3>
      <p class="text-ink-secondary">换个关键词试试吧</p>
    </div>

    <!-- 初始状态 -->
    <div v-else class="flex flex-col items-center justify-center py-20">
      <div class="w-24 h-24 rounded-full bg-white/[0.03] flex items-center justify-center mb-6 border border-white/5">
        <Search class="w-12 h-12 text-ink-muted/25" />
      </div>
      <h3 class="text-xl font-semibold mb-2 text-white">开始搜索</h3>
      <p class="text-ink-secondary text-center max-w-md">
        输入关键词搜索你喜欢的歌曲、歌手或专辑
      </p>
    </div>
  </div>
</template>

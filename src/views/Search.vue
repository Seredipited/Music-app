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
  <div class="container mx-auto px-4 py-8">
    <!-- Search Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-6 text-earth-100">搜索音乐</h1>
      <form @submit.prevent="handleSearch" class="relative max-w-2xl">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="输入歌名、歌手或专辑名称..."
          class="w-full pl-12 pr-12 py-4 bg-earth-800/50 border border-earth-700/50 rounded-2xl text-lg focus:outline-none focus:border-primary/50 focus:bg-earth-800 transition-all text-earth-100 placeholder:text-earth-500"
        />
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-400" />
        <button
          v-if="searchQuery"
          type="button"
          @click="clearSearch"
          class="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-earth-700/50 rounded-full"
        >
          <X class="w-5 h-5 text-earth-400" />
        </button>
      </form>
    </div>

    <!-- Loading State -->
    <div v-if="isSearching" class="flex flex-col items-center justify-center py-20">
      <Loader2 class="w-12 h-12 text-primary animate-spin mb-4" />
      <p class="text-earth-400">正在搜索...</p>
    </div>

    <!-- Search Results -->
    <div v-else-if="hasSearched && searchResults.length > 0">
      <div class="flex items-center justify-between mb-6">
        <p class="text-earth-400">
          找到 <span class="text-primary font-semibold">{{ searchResults.length }}</span> 首相关歌曲
        </p>
      </div>
      
      <div class="bg-earth-800/50 rounded-2xl overflow-hidden border border-earth-700/50">
        <div class="grid grid-cols-12 gap-4 px-4 py-3 text-sm text-earth-400 border-b border-earth-700/50">
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
          class="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-earth-700/30 cursor-pointer transition-colors group"
          :class="{ 'bg-primary/10': playerStore.currentSong?.id === song.id }"
        >
          <div class="col-span-1">
            <span v-if="playerStore.currentSong?.id !== song.id" class="text-earth-500 group-hover:hidden">
              {{ index + 1 }}
            </span>
            <Play v-if="playerStore.currentSong?.id === song.id && playerStore.isPlaying" class="w-4 h-4 text-primary" fill="currentColor" />
            <Play v-else class="w-4 h-4 hidden group-hover:block" />
          </div>
          <div class="col-span-5 sm:col-span-4 flex items-center gap-3">
            <img :src="song.cover" :alt="song.name" class="w-10 h-10 rounded object-cover" />
            <div class="min-w-0">
              <p class="font-medium text-sm truncate" :class="{ 'text-primary': playerStore.currentSong?.id === song.id }">
                {{ song.name }}
              </p>
              <p class="text-xs text-earth-500 truncate sm:hidden">{{ song.artist }}</p>
            </div>
          </div>
          <div class="col-span-3 hidden sm:block">
            <p class="text-sm text-earth-400 truncate hover:text-primary">{{ song.artist }}</p>
          </div>
          <div class="col-span-2 hidden md:block">
            <p class="text-sm text-earth-400 truncate">{{ song.album }}</p>
          </div>
          <div class="col-span-1 flex justify-end">
            <span class="text-sm text-earth-500">{{ formatTime(song.duration) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- No Results -->
    <div v-else-if="hasSearched && searchResults.length === 0" class="flex flex-col items-center justify-center py-20">
      <Music2 class="w-16 h-16 text-earth-500 mb-4" />
      <h3 class="text-xl font-semibold mb-2 text-earth-100">未找到相关歌曲</h3>
      <p class="text-earth-500">换个关键词试试吧</p>
    </div>

    <!-- Initial State -->
    <div v-else class="flex flex-col items-center justify-center py-20">
      <div class="w-24 h-24 rounded-full bg-earth-800 flex items-center justify-center mb-6 border border-earth-700/50">
        <Search class="w-12 h-12 text-earth-500" />
      </div>
      <h3 class="text-xl font-semibold mb-2 text-earth-100">开始搜索</h3>
      <p class="text-earth-500 text-center max-w-md">
        输入关键词搜索你喜欢的歌曲、歌手或专辑
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Search, Music2, Home, ListMusic, User } from 'lucide-vue-next'

const router = useRouter()
const searchQuery = ref('')

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value } })
  }
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-earth-700/50">
    <div class="container mx-auto px-4 h-16 flex items-center justify-between">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2 hover-lift">
        <div class="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
          <Music2 class="w-6 h-6 text-white" />
        </div>
        <span class="text-xl font-bold text-gradient hidden sm:block">云音乐</span>
      </RouterLink>

      <!-- Navigation -->
      <nav class="flex items-center gap-1 sm:gap-2">
        <RouterLink
          to="/"
          class="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-earth-700/50 text-earth-200"
          active-class="bg-primary/20 text-primary"
        >
          <Home class="w-4 h-4" />
          <span class="hidden xs:inline">首页</span>
        </RouterLink>
        <RouterLink
          to="/search"
          class="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-earth-700/50 text-earth-200"
          active-class="bg-primary/20 text-primary"
        >
          <ListMusic class="w-4 h-4" />
          <span class="hidden xs:inline">歌单</span>
        </RouterLink>
      </nav>

      <!-- Search -->
      <div class="flex-1 max-w-md mx-4 hidden md:block">
        <form @submit.prevent="handleSearch" class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索音乐、歌手、专辑..."
            class="w-full pl-10 pr-4 py-2 bg-earth-800/50 border border-earth-700/50 rounded-full text-sm focus:outline-none focus:border-primary/50 focus:bg-earth-800 transition-all text-earth-100 placeholder:text-earth-500"
          />
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
        </form>
      </div>

      <!-- User -->
      <button class="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center hover-lift">
        <User class="w-4 h-4 text-white" />
      </button>
    </div>

    <!-- Mobile Search -->
    <div class="md:hidden px-4 pb-3">
      <form @submit.prevent="handleSearch" class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索音乐、歌手、专辑..."
          class="w-full pl-10 pr-4 py-2 bg-earth-800/50 border border-earth-700/50 rounded-full text-sm focus:outline-none focus:border-primary/50 transition-all text-earth-100 placeholder:text-earth-500"
        />
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
      </form>
    </div>
  </header>
</template>

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
  <header class="shrink-0 glass-effect border-b border-white/5">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2.5 group">
        <div class="w-9 h-9 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
          <Music2 class="w-5 h-5 text-white" />
        </div>
        <span class="text-lg font-bold text-gradient hidden sm:block">云音乐</span>
      </RouterLink>

      <!-- Navigation -->
      <nav class="flex items-center gap-1">
        <RouterLink
          to="/"
          class="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 text-white/60 hover:text-white hover:bg-white/5"
          active-class="!text-indigo-300 !bg-indigo-500/10"
        >
          <Home class="w-4 h-4" />
          <span class="hidden sm:inline">首页</span>
        </RouterLink>
        <RouterLink
          to="/search"
          class="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 text-white/60 hover:text-white hover:bg-white/5"
          active-class="!text-indigo-300 !bg-indigo-500/10"
        >
          <ListMusic class="w-4 h-4" />
          <span class="hidden sm:inline">发现</span>
        </RouterLink>
      </nav>

      <!-- Search -->
      <div class="flex-1 max-w-sm mx-4 hidden md:block">
        <form @submit.prevent="handleSearch" class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索音乐、歌手、专辑..."
            class="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white/80 placeholder:text-white/30 focus:outline-none focus:border-indigo-500/40 focus:bg-white/8 transition-all"
          />
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        </form>
      </div>

      <!-- User -->
      <RouterLink
        to="/login"
        class="w-9 h-9 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-shadow"
      >
        <User class="w-4 h-4 text-white" />
      </RouterLink>
    </div>

    <!-- Mobile Search -->
    <div class="md:hidden px-4 pb-3">
      <form @submit.prevent="handleSearch" class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索音乐、歌手、专辑..."
          class="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white/80 placeholder:text-white/30 focus:outline-none focus:border-indigo-500/40 transition-all"
        />
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
      </form>
    </div>
  </header>
</template>

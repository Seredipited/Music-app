<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Search, ChevronLeft, ChevronRight, Bell, User } from 'lucide-vue-next'

const router = useRouter()
const searchQuery = ref('')

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value } })
  }
}
</script>

<template>
  <header class="shrink-0 h-16 border-b border-white/5 bg-surface/60 backdrop-blur-xl flex items-center px-6 gap-6">
    <!-- 左侧：导航箭头 -->
    <div class="flex items-center gap-2">
      <button class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-ink-secondary hover:text-white hover:bg-white/10 transition-colors">
        <ChevronLeft class="w-4 h-4" />
      </button>
      <button class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-ink-secondary hover:text-white hover:bg-white/10 transition-colors">
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>

    <!-- 中间：搜索栏 -->
    <div class="flex-1 max-w-xl mx-auto">
      <form @submit.prevent="handleSearch" class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索歌曲、歌手、专辑..."
          class="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/5 rounded-xl text-sm text-white placeholder:text-ink-muted/60 focus:outline-none focus:border-primary-400/30 focus:bg-white/[0.06] transition-all"
        />
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
      </form>
    </div>

    <!-- 右侧：操作区 -->
    <div class="flex items-center gap-2">
      <button class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-ink-secondary hover:text-white hover:bg-white/10 transition-colors">
        <Bell class="w-4 h-4" />
      </button>
      <RouterLink
        to="/login"
        class="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/20 hover:shadow-primary-500/35 transition-shadow"
      >
        <User class="w-4 h-4 text-white" />
      </RouterLink>
    </div>
  </header>
</template>

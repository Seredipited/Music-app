<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { 
  Home, Search, Disc3, Heart, Clock, 
  TrendingUp, User, Music2 
} from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/search', icon: Search, label: '发现' },
]

const libraryItems = [
  { icon: TrendingUp, label: '热门推荐', path: '/' },
  { icon: Clock, label: '最近播放', path: '/' },
  { icon: Heart, label: '我的收藏', path: '/' },
]

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <aside class="w-[220px] shrink-0 h-screen flex flex-col border-r border-white/5 bg-[#151c30]">
    <!-- Logo -->
    <RouterLink 
      to="/" 
      class="flex items-center gap-3 px-6 py-6 shrink-0"
    >
      <div class="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/25">
        <Music2 class="w-5 h-5 text-white" />
      </div>
      <span class="text-lg font-bold text-gradient">云音乐</span>
    </RouterLink>

    <!-- Primary Navigation -->
    <nav class="px-3 flex flex-col gap-0.5 shrink-0">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
        :class="isActive(item.path) 
          ? 'bg-primary-500/10 text-primary-300' 
          : 'text-ink-secondary hover:text-white hover:bg-white/[0.04]'"
      >
        <component :is="item.icon" class="w-4.5 h-4.5" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <!-- Library Section -->
    <div class="px-6 mt-8 mb-3 shrink-0">
      <h3 class="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">音乐库</h3>
    </div>
    <nav class="px-3 flex flex-col gap-0.5 shrink-0">
      <RouterLink
        v-for="item in libraryItems"
        :key="item.label"
        :to="item.path"
        class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 text-ink-secondary hover:text-white hover:bg-white/[0.04]"
      >
        <component :is="item.icon" class="w-4 h-4" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <!-- Spacer -->
    <div class="flex-1"></div>

    <!-- User Section -->
    <div class="px-3 pb-4 shrink-0">
      <RouterLink
        to="/login"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 text-ink-secondary hover:text-white hover:bg-white/[0.04]"
      >
        <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
          <User class="w-4 h-4" />
        </div>
        <span>登录 / 注册</span>
      </RouterLink>
    </div>
  </aside>
</template>

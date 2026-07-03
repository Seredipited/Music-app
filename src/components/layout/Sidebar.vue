<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Music, Tag, Bookmark, Users, Disc, BarChart3 } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  activeMenu?: string
}>(), {
  activeMenu: 'songs'
})

const emit = defineEmits<{
  'update:activeMenu': [value: string]
}>()

const router = useRouter()

const menuItems = [
  { key: 'songs', label: '音乐歌曲', icon: Music },
  { key: 'genres', label: '音乐类型', icon: Tag },
  { key: 'tags', label: '音乐标签', icon: Bookmark },
  { key: 'artists', label: '歌手管理', icon: Users },
  { key: 'albums', label: '专辑管理', icon: Disc },
  { key: 'stats', label: '统计分析', icon: BarChart3 },
]

const menuRouteMap: Record<string, string> = {
  songs: '/admin/songs',
  genres: '/admin/genres',
  tags: '/admin/tags',
  artists: '/admin/artists',
  albums: '/admin/albums',
  stats: '/admin/stats'
}

function selectMenu(key: string) {
  emit('update:activeMenu', key)
  router.push(menuRouteMap[key])
}
</script>

<template>
  <aside class="w-56 min-h-screen bg-[#2c3e50] flex flex-col shrink-0">
    <!-- Logo -->
    <div class="h-14 px-4 flex items-center gap-2 border-b border-white/10">
      <Music class="w-6 h-6 text-white" />
      <h1 class="text-white font-semibold text-base tracking-wide">音乐管理系统</h1>
    </div>

    <!-- Menu -->
    <nav class="flex-1 py-2">
      <button
        v-for="item in menuItems"
        :key="item.key"
        @click="selectMenu(item.key)"
        class="w-full flex items-center gap-3 px-5 py-3 text-sm transition-colors cursor-pointer"
        :class="activeMenu === item.key
          ? 'bg-[#16a085] text-white font-medium'
          : 'text-white/80 hover:bg-white/10 hover:text-white'"
      >
        <component :is="item.icon" class="w-[18px] h-[18px] shrink-0" />
        {{ item.label }}
      </button>
    </nav>
  </aside>
</template>

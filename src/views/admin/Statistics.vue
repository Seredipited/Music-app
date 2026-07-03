<script setup lang="ts">
import { computed } from 'vue'
import { mockSongs } from '@/stores/data'
import { BarChart3, Music, Users, Disc, Clock } from 'lucide-vue-next'

const stats = computed(() => {
  const totalSongs = mockSongs.length
  const totalDuration = mockSongs.reduce((sum, s) => sum + s.duration, 0)
  const artists = new Set(mockSongs.map(s => s.artist))
  const albums = new Set(mockSongs.map(s => s.album))

  return {
    totalSongs,
    totalDuration,
    artistCount: artists.size,
    albumCount: albums.size
  }
})

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const hours = Math.floor(mins / 60)
  return `${hours}小时 ${mins % 60}分钟`
}
</script>

<template>
  <div class="px-8 py-6">
    <h2 class="text-xl font-bold text-gray-800 mb-6">统计分析</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
          <Music class="w-6 h-6 text-[#409eff]" />
        </div>
        <div>
          <p class="text-sm text-[#909399]">歌曲总数</p>
          <p class="text-2xl font-bold text-[#303133]">{{ stats.totalSongs }}</p>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
          <Users class="w-6 h-6 text-[#67c23a]" />
        </div>
        <div>
          <p class="text-sm text-[#909399]">歌手数量</p>
          <p class="text-2xl font-bold text-[#303133]">{{ stats.artistCount }}</p>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
          <Disc class="w-6 h-6 text-[#8b5cf6]" />
        </div>
        <div>
          <p class="text-sm text-[#909399]">专辑数量</p>
          <p class="text-2xl font-bold text-[#303133]">{{ stats.albumCount }}</p>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
          <Clock class="w-6 h-6 text-[#e6a23c]" />
        </div>
        <div>
          <p class="text-sm text-[#909399]">总时长</p>
          <p class="text-2xl font-bold text-[#303133]">{{ formatTime(stats.totalDuration) }}</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <h3 class="text-base font-bold text-[#303133] mb-4 flex items-center gap-2">
        <BarChart3 class="w-4 h-4 text-[#409eff]" />
        数据概览
      </h3>
      <p class="text-sm text-[#606266] leading-relaxed">
        当前平台共收录 <span class="font-semibold text-[#409eff]">{{ stats.totalSongs }}</span> 首歌曲，
        涵盖 <span class="font-semibold text-[#67c23a]">{{ stats.artistCount }}</span> 位歌手、
        <span class="font-semibold text-[#8b5cf6]">{{ stats.albumCount }}</span> 张专辑。
        累计音乐时长 <span class="font-semibold text-[#e6a23c]">{{ formatTime(stats.totalDuration) }}</span>。
        数据每日自动更新，为运营决策提供参考。
      </p>
    </div>
  </div>
</template>

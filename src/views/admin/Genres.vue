<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Music } from 'lucide-vue-next'

interface Genre {
  id: number
  name: string
  description: string
  songCount: number
}

const genres = ref<Genre[]>([
  { id: 1, name: '流行', description: '华语流行金曲，广受欢迎的主流音乐', songCount: 0 },
  { id: 2, name: '摇滚', description: '激情澎湃的摇滚乐曲', songCount: 0 },
  { id: 3, name: '古典', description: '经典优雅的古典音乐', songCount: 0 },
  { id: 4, name: '爵士', description: '富有韵味的爵士风情', songCount: 0 },
  { id: 5, name: '民谣', description: '诉说故事的民谣曲调', songCount: 0 },
  { id: 6, name: '电子', description: '现代感十足的电子音乐', songCount: 0 },
  { id: 7, name: '说唱', description: '节奏感强的说唱作品', songCount: 0 },
  { id: 8, name: 'R&B', description: '节奏蓝调，柔情动人', songCount: 0 },
])

onMounted(() => {
  genres.value.forEach(g => {
    g.songCount = Math.floor(Math.random() * 10) + 2
  })
})
</script>

<template>
  <div class="px-8 py-6">
    <h2 class="text-xl font-bold text-gray-800 mb-6">音乐类型管理</h2>
    <div class="bg-white rounded shadow-sm overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-[#fafafa] border-b border-[#ebeef5] text-left">
            <th class="px-5 py-3 font-medium text-[#606266] w-20">ID</th>
            <th class="px-5 py-3 font-medium text-[#606266] w-48">类型名称</th>
            <th class="px-5 py-3 font-medium text-[#606266]">描述</th>
            <th class="px-5 py-3 font-medium text-[#606266] w-28">歌曲数量</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="genre in genres"
            :key="genre.id"
            class="border-b border-[#ebeef5] last:border-0 hover:bg-blue-50/50 transition-colors"
          >
            <td class="px-5 py-3.5 text-[#909399]">{{ genre.id }}</td>
            <td class="px-5 py-3.5 text-[#303133] font-medium flex items-center gap-2">
              <Music class="w-4 h-4 text-[#409eff]" />
              {{ genre.name }}
            </td>
            <td class="px-5 py-3.5 text-[#606266]">{{ genre.description }}</td>
            <td class="px-5 py-3.5 text-[#909399]">{{ genre.songCount }} 首</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

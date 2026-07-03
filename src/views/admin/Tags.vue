<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Bookmark } from 'lucide-vue-next'

interface Tag {
  id: number
  name: string
  color: string
  songCount: number
}

const tags = ref<Tag[]>([
  { id: 1, name: '经典', color: '#e6a23c', songCount: 0 },
  { id: 2, name: '热门', color: '#f56c6c', songCount: 0 },
  { id: 3, name: '伤感', color: '#909399', songCount: 0 },
  { id: 4, name: '励志', color: '#67c23a', songCount: 0 },
  { id: 5, name: '浪漫', color: '#f59e0b', songCount: 0 },
  { id: 6, name: '治愈', color: '#409eff', songCount: 0 },
  { id: 7, name: '怀旧', color: '#8b5cf6', songCount: 0 },
  { id: 8, name: '欢快', color: '#10b981', songCount: 0 },
])

onMounted(() => {
  tags.value.forEach(t => {
    t.songCount = Math.floor(Math.random() * 12) + 3
  })
})
</script>

<template>
  <div class="px-8 py-6">
    <h2 class="text-xl font-bold text-gray-800 mb-6">音乐标签管理</h2>
    <div class="bg-white rounded shadow-sm overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-[#fafafa] border-b border-[#ebeef5] text-left">
            <th class="px-5 py-3 font-medium text-[#606266] w-20">ID</th>
            <th class="px-5 py-3 font-medium text-[#606266] w-48">标签名称</th>
            <th class="px-5 py-3 font-medium text-[#606266] w-32">颜色</th>
            <th class="px-5 py-3 font-medium text-[#606266] w-28">歌曲数量</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="tag in tags"
            :key="tag.id"
            class="border-b border-[#ebeef5] last:border-0 hover:bg-blue-50/50 transition-colors"
          >
            <td class="px-5 py-3.5 text-[#909399]">{{ tag.id }}</td>
            <td class="px-5 py-3.5 text-[#303133] font-medium flex items-center gap-2">
              <Bookmark class="w-4 h-4" :style="{ color: tag.color }" />
              {{ tag.name }}
            </td>
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-2">
                <span class="w-4 h-4 rounded-full border border-gray-200" :style="{ backgroundColor: tag.color }"></span>
                <span class="text-[#606266]">{{ tag.color }}</span>
              </div>
            </td>
            <td class="px-5 py-3.5 text-[#909399]">{{ tag.songCount }} 首</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

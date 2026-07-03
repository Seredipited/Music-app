<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { mockSongs } from '@/stores/data'
import { Disc } from 'lucide-vue-next'

interface Album {
  id: number
  name: string
  artist: string
  cover: string
  songCount: number
  year: number
}

const albums = ref<Album[]>([])

onMounted(() => {
  const map = new Map<string, { artist: string; cover: string; songs: number; year: number }>()
  mockSongs.forEach(song => {
    const key = `${song.album}::${song.artist}`
    if (!map.has(key)) {
      map.set(key, { artist: song.artist, cover: song.cover, songs: 0, year: 2010 + (song.id % 15) })
    }
    const info = map.get(key)!
    info.songs++
  })

  let id = 1
  albums.value = Array.from(map.entries()).map(([name, info]) => ({
    id: id++,
    name: name.split('::')[0],
    artist: info.artist,
    cover: info.cover,
    songCount: info.songs,
    year: info.year
  }))
})
</script>

<template>
  <div class="px-8 py-6">
    <h2 class="text-xl font-bold text-gray-800 mb-6">专辑管理</h2>
    <div class="bg-white rounded shadow-sm overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-[#fafafa] border-b border-[#ebeef5] text-left">
            <th class="px-5 py-3 font-medium text-[#606266] w-20">ID</th>
            <th class="px-5 py-3 font-medium text-[#606266]">专辑名称</th>
            <th class="px-5 py-3 font-medium text-[#606266]">歌手</th>
            <th class="px-5 py-3 font-medium text-[#606266] w-32">发行年份</th>
            <th class="px-5 py-3 font-medium text-[#606266] w-32">歌曲数量</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="album in albums"
            :key="album.id"
            class="border-b border-[#ebeef5] last:border-0 hover:bg-blue-50/50 transition-colors"
          >
            <td class="px-5 py-3.5 text-[#909399]">{{ album.id }}</td>
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-3">
                <img :src="album.cover" :alt="album.name" class="w-9 h-9 rounded object-cover" />
                <span class="font-medium text-[#303133]">{{ album.name }}</span>
              </div>
            </td>
            <td class="px-5 py-3.5 text-[#606266]">{{ album.artist }}</td>
            <td class="px-5 py-3.5 text-[#909399]">{{ album.year }}</td>
            <td class="px-5 py-3.5 text-[#606266]">{{ album.songCount }} 首</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

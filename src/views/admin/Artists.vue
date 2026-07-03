<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { mockSongs } from '@/stores/data'
import { Users } from 'lucide-vue-next'

interface Artist {
  id: number
  name: string
  avatar: string
  songCount: number
  albumCount: number
}

const artists = ref<Artist[]>([])

onMounted(() => {
  const map = new Map<string, { avatar: string; songs: number; albums: Set<string> }>()
  mockSongs.forEach(song => {
    if (!map.has(song.artist)) {
      map.set(song.artist, { avatar: song.cover, songs: 0, albums: new Set() })
    }
    const info = map.get(song.artist)!
    info.songs++
    info.albums.add(song.album)
  })

  let id = 1
  artists.value = Array.from(map.entries()).map(([name, info]) => ({
    id: id++,
    name,
    avatar: info.avatar,
    songCount: info.songs,
    albumCount: info.albums.size
  }))
})
</script>

<template>
  <div class="px-8 py-6">
    <h2 class="text-xl font-bold text-gray-800 mb-6">歌手管理</h2>
    <div class="bg-white rounded shadow-sm overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-[#fafafa] border-b border-[#ebeef5] text-left">
            <th class="px-5 py-3 font-medium text-[#606266] w-20">ID</th>
            <th class="px-5 py-3 font-medium text-[#606266]">歌手</th>
            <th class="px-5 py-3 font-medium text-[#606266] w-32">歌曲数量</th>
            <th class="px-5 py-3 font-medium text-[#606266] w-32">专辑数量</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="artist in artists"
            :key="artist.id"
            class="border-b border-[#ebeef5] last:border-0 hover:bg-blue-50/50 transition-colors"
          >
            <td class="px-5 py-3.5 text-[#909399]">{{ artist.id }}</td>
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-3">
                <img :src="artist.avatar" :alt="artist.name" class="w-9 h-9 rounded object-cover" />
                <span class="font-medium text-[#303133]">{{ artist.name }}</span>
              </div>
            </td>
            <td class="px-5 py-3.5 text-[#606266]">{{ artist.songCount }} 首</td>
            <td class="px-5 py-3.5 text-[#606266]">{{ artist.albumCount }} 张</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

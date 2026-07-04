<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { Play, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { Song } from '@/stores/types'
import { fetchSongs, createSong } from '@/lib/api'
import Dialog from '@/components/ui/Dialog.vue'
import SongForm from '@/components/ui/SongForm.vue'
import type { SongFormData } from '@/components/ui/SongForm.vue'

const playerStore = usePlayerStore()

const allSongs = ref<Song[]>([])
const searchQuery = ref('')
const isLoading = ref(false)

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)

// Dialog state
const showAddSongDialog = ref(false)

onMounted(() => {
  loadSongs()
})

async function loadSongs() {
  isLoading.value = true
  try {
    allSongs.value = await fetchSongs()
  } catch (err) {
    console.error('加载歌曲失败:', err)
  } finally {
    isLoading.value = false
  }
}

const filteredSongs = computed(() => {
  if (!searchQuery.value) return allSongs.value
  const q = searchQuery.value.toLowerCase()
  return allSongs.value.filter(
    s =>
      s.name.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q) ||
      s.album.toLowerCase().includes(q)
  )
})

const totalItems = computed(() => filteredSongs.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))

const pageSongs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredSongs.value.slice(start, end)
})

function playSong(song: Song) {
  playerStore.setCurrentSong(song, allSongs.value)
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function formatDate(date: Date | string): string {
  if (typeof date === 'string') return date
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function handlePageChange(page: number) {
  currentPage.value = page
}

async function handleAddSong(data: SongFormData) {
  const formData = new FormData()
  formData.append('name', data.name)
  formData.append('artist', data.artist)
  formData.append('album', data.album)
  formData.append('duration', data.duration)
  formData.append('genre', data.genre)
  formData.append('cover', data.cover)
  if (data.audioFile) {
    formData.append('audio', data.audioFile)
  }

  try {
    const newSong = await createSong(formData)
    allSongs.value = [newSong, ...allSongs.value]
    currentPage.value = 1
    showAddSongDialog.value = false
  } catch (err) {
    console.error('添加歌曲失败:', err)
  }
}
</script>

<template>
  <!-- Page Header -->
  <div class="px-8 py-6">
    <h2 class="text-xl font-bold text-gray-800">音乐歌曲管理</h2>
  </div>

  <!-- Toolbar -->
  <div class="px-8 pb-4 flex items-center justify-between">
    <div class="relative w-80">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索歌曲或歌手"
        class="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:ring-0 transition-colors"
      />
    </div>
    <button
      @click="showAddSongDialog = true"
      class="flex items-center gap-1.5 px-4 py-2 bg-[#409eff] hover:bg-[#66b1ff] text-white text-sm rounded transition-colors cursor-pointer"
    >
      <Plus class="w-4 h-4" />
      添加音乐
    </button>
  </div>

  <!-- Table Container -->
  <div class="mx-8 mb-6 bg-white rounded shadow-sm overflow-hidden">
    <table class="w-full text-sm">
      <thead>
        <tr class="bg-[#fafafa] border-b border-[#ebeef5] text-left">
          <th class="px-5 py-3 font-medium text-[#606266] w-20">ID</th>
          <th class="px-5 py-3 font-medium text-[#606266] w-48">歌曲名称</th>
          <th class="px-5 py-3 font-medium text-[#606266] w-44">歌手</th>
          <th class="px-5 py-3 font-medium text-[#606266] w-56">专辑</th>
          <th class="px-5 py-3 font-medium text-[#606266] w-24">时长</th>
          <th class="px-5 py-3 font-medium text-[#606266] w-28">流派</th>
          <th class="px-5 py-3 font-medium text-[#606266] w-32">发行日期</th>
          <th class="px-5 py-3 font-medium text-[#606266] w-24">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isLoading">
          <td colspan="8" class="px-5 py-12 text-center text-[#c0c4cc]">加载中...</td>
        </tr>
        <tr
          v-for="(song, index) in pageSongs"
          v-else
          :key="song.id"
          class="border-b border-[#ebeef5] last:border-0 hover:bg-blue-50/50 transition-colors group"
          :class="{ 'bg-primary/5': playerStore.currentSong?.id === song.id }"
        >
          <td class="px-5 py-3.5 text-[#909399]">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
          <td class="px-5 py-3.5">
            <div class="flex items-center gap-3">
              <img
                :src="song.cover"
                alt=""
                class="w-9 h-9 rounded object-cover shrink-0"
              />
              <span
                class="font-medium text-[#303133] truncate max-w-[160px]"
                :class="{ 'text-[#409eff]': playerStore.currentSong?.id === song.id }"
              >{{ song.name }}</span>
            </div>
          </td>
          <td class="px-5 py-3.5 text-[#606266] truncate max-w-[150px]">{{ song.artist }}</td>
          <td class="px-5 py-3.5 text-[#606266] truncate max-w-[200px]">{{ song.album }}</td>
          <td class="px-5 py-3.5 text-[#909399]">{{ formatTime(song.duration) }}</td>
          <td class="px-5 py-3.5 text-[#606266]">{{ song.genre || '流行' }}</td>
          <td class="px-5 py-3.5 text-[#909399]">{{ formatDate(new Date(2020 - (song.id % 7), ((song.id % 12) + 1), ((song.id % 28) + 1))) }}</td>
          <td class="px-5 py-3.5">
            <div class="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                @click="playSong(song)"
                class="p-1.5 rounded hover:bg-blue-100 text-[#409eff] transition-colors cursor-pointer"
                title="播放"
              >
                <Play class="w-4 h-4" fill="currentColor" />
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="pageSongs.length === 0 && !isLoading">
          <td colspan="8" class="px-5 py-12 text-center text-[#c0c4cc]">
            暂无数据，请先上传歌曲或确保后端服务已启动
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Pagination -->
  <div v-if="totalPages > 1" class="px-8 pb-8 flex items-center justify-between">
    <span class="text-sm text-[#606266]">共 {{ totalItems }} 条</span>
    <div class="flex items-center gap-1">
      <select
        v-model="pageSize"
        class="mr-3 h-8 px-2 border border-[#dcdfe6] rounded text-sm text-[#606266] focus:outline-none focus:border-[#409eff]"
      >
        <option :value="5">5条/页</option>
        <option :value="10">10条/页</option>
        <option :value="15">15条/页</option>
        <option :value="20">20条/页</option>
      </select>
      <button
        @click="currentPage > 1 && handlePageChange(currentPage - 1)"
        :disabled="currentPage <= 1"
        class="w-8 h-8 flex items-center justify-center border border-[#dcdfe6] rounded text-[#606266] disabled:text-[#c0c4cc] disabled:cursor-not-allowed hover:text-[#409eff] hover:border-[#409eff] transition-colors cursor-pointer disabled:hover:text-[#c0c4cc] disabled:hover:border-[#dcdfe6]"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>
      <button
        @click="handlePageChange(page)"
        v-for="page in totalPages"
        :key="page"
        class="min-w-[32px] h-8 px-2 flex items-center justify-center border rounded text-sm transition-colors cursor-pointer"
        :class="currentPage === page
          ? 'bg-[#409eff] border-[#409eff] text-white'
          : 'border-[#dcdfe6] text-[#606266] hover:text-[#409eff] hover:border-[#409eff]'"
      >
        {{ page }}
      </button>
      <button
        @click="currentPage < totalPages && handlePageChange(currentPage + 1)"
        :disabled="currentPage >= totalPages"
        class="w-8 h-8 flex items-center justify-center border border-[#dcdfe6] rounded text-[#606266] disabled:text-[#c0c4cc] disabled:cursor-not-allowed hover:text-[#409eff] hover:border-[#409eff] transition-colors cursor-pointer disabled:hover:text-[#c0c4cc] disabled:hover:border-[#dcdfe6]"
      >
        <ChevronRight class="w-4 h-4" />
      </button>
      <span class="ml-3 text-sm text-[#606266]">
        前往
        <input
          type="number"
          :value="currentPage"
          @change="handlePageChange(parseInt(($event.target as HTMLInputElement).value))"
          min="1"
          :max="totalPages"
          class="w-12 h-7 mx-1 text-center border border-[#dcdfe6] rounded text-sm text-[#606266] focus:outline-none focus:border-[#409eff]"
        />
        页
      </span>
    </div>
  </div>

  <!-- Add Song Dialog -->
  <Dialog
    v-model:open="showAddSongDialog"
    title="添加歌曲"
    @close="showAddSongDialog = false"
  >
    <SongForm
      @submit="handleAddSong"
      @cancel="showAddSongDialog = false"
    />
  </Dialog>
</template>

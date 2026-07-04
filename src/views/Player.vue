<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { fetchSongs } from '@/lib/api'
import CommentSection from '@/components/comments/CommentSection.vue'
import { 
  ArrowLeft, Play, Pause, SkipBack, SkipForward,
  Heart, Share2, ListMusic, Volume2, VolumeX,
  Repeat, Repeat1, Shuffle, Disc3
} from 'lucide-vue-next'
import type { Song } from '@/stores/types'

const route = useRoute()
const router = useRouter()
const playerStore = usePlayerStore()

const currentSong = ref<Song | null>(null)
const allSongs = ref<Song[]>([])
const isDragging = ref(false)
const likedSongs = ref<number[]>([])

onMounted(async () => {
  try {
    allSongs.value = await fetchSongs()
  } catch {
    allSongs.value = []
  }
  
  // 路由参数加载歌曲
  const id = route.params.id
  if (id) {
    const song = allSongs.value.find(s => s.id === Number(id))
    if (song) {
      currentSong.value = song
      if (playerStore.currentSong?.id !== song.id) {
        playerStore.setCurrentSong(song, allSongs.value)
      }
    }
  }
})

const playModeIcon = computed(() => {
  switch (playerStore.playMode) {
    case 'sequence': return Repeat
    case 'random': return Shuffle
    case 'loop': return Repeat1
  }
})

const playModeText = computed(() => {
  switch (playerStore.playMode) {
    case 'sequence': return '顺序播放'
    case 'random': return '随机播放'
    case 'loop': return '单曲循环'
  }
})

watch(() => route.params.id, (id) => {
  if (id) {
    const song = allSongs.value.find(s => s.id === Number(id))
    if (song) {
      currentSong.value = song
      if (playerStore.currentSong?.id !== song.id) {
        playerStore.setCurrentSong(song, allSongs.value)
      }
    }
  }
})

watch(() => playerStore.currentSong, (song) => {
  if (song) {
    currentSong.value = song
  }
})

function handleProgressClick(event: MouseEvent) {
  const audio = playerStore.audioEl
  if (!audio) return
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  const time = percent * playerStore.duration
  audio.currentTime = time
  playerStore.setProgress(time)
}

function togglePlayMode() {
  const modes: Array<'sequence' | 'random' | 'loop'> = ['sequence', 'random', 'loop']
  const currentIndex = modes.indexOf(playerStore.playMode)
  const nextMode = modes[(currentIndex + 1) % modes.length]
  playerStore.setPlayMode(nextMode)
}

function toggleLike() {
  if (!currentSong.value) return
  const index = likedSongs.value.indexOf(currentSong.value.id)
  if (index > -1) {
    likedSongs.value.splice(index, 1)
  } else {
    likedSongs.value.push(currentSong.value.id)
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function goBack() {
  router.back()
}
</script>

<template>
  <div class="px-6 lg:px-10 py-6">
    <!-- 返回按钮 -->
    <button
      @click="goBack"
      class="flex items-center gap-2 text-ink-secondary hover:text-primary-300 transition-colors mb-6"
    >
      <ArrowLeft class="w-5 h-5" />
      <span>返回</span>
    </button>

    <div class="grid lg:grid-cols-2 gap-8">
      <!-- 播放器区域 -->
      <div class="flex flex-col items-center">
        <!-- 专辑封面 -->
        <div class="relative mb-8">
          <div class="absolute inset-0 gradient-primary rounded-full opacity-20 blur-3xl"></div>
          <div class="relative">
            <div 
              class="w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-2xl border-2 border-white/10" 
              :class="{ 'animate-spin-slow': playerStore.isPlaying }"
            >
              <img
                v-if="currentSong"
                :src="currentSong.cover"
                :alt="currentSong.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full bg-surface-300 flex items-center justify-center">
                <Disc3 class="w-24 h-24 text-ink-muted/30" />
              </div>
            </div>
            <!-- 播放发光 -->
            <div
              v-if="playerStore.isPlaying"
              class="absolute inset-0 rounded-full border-2 border-primary-400/30 animate-pulse"
            ></div>
          </div>
        </div>

        <!-- 歌曲信息 -->
        <div class="text-center mb-8 w-full max-w-md">
          <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">
            {{ currentSong?.name || '未选择歌曲' }}
          </h1>
          <p class="text-ink-secondary">
            {{ currentSong?.artist || '请选择一首歌曲播放' }}
          </p>
        </div>

        <!-- 进度条 -->
        <div class="w-full max-w-md mb-6">
          <div
            class="h-1 bg-white/[0.06] rounded-full cursor-pointer group"
            @click="handleProgressClick"
          >
            <div
              class="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full relative progress-transition"
              :style="{ width: `${playerStore.progress}%` }"
            >
              <div class="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
          <div class="flex justify-between mt-2 text-xs text-ink-muted">
            <span>{{ formatTime(playerStore.currentTime) }}</span>
            <span>{{ formatTime(playerStore.duration) }}</span>
          </div>
        </div>

        <!-- 控制按钮 -->
        <div class="flex items-center gap-4 sm:gap-6">
          <button
            @click="togglePlayMode"
            class="p-2 hover:bg-white/[0.06] rounded-full transition-colors text-ink-secondary hover:text-ink-secondary"
            :title="playModeText"
          >
            <component :is="playModeIcon" class="w-5 h-5" />
          </button>

          <button
            @click="playerStore.playPrev"
            class="p-3 hover:bg-white/[0.06] rounded-full transition-colors text-ink-secondary hover:text-white"
            :disabled="!currentSong"
          >
            <SkipBack class="w-6 h-6" />
          </button>

          <button
            @click="playerStore.togglePlay"
            class="w-16 h-16 rounded-full gradient-primary flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-primary-500/30"
            :disabled="!currentSong"
          >
            <Pause v-if="playerStore.isPlaying" class="w-8 h-8 text-white" />
            <Play v-else class="w-8 h-8 text-white ml-1" />
          </button>

          <button
            @click="playerStore.playNext"
            class="p-3 hover:bg-white/[0.06] rounded-full transition-colors text-ink-secondary hover:text-white"
            :disabled="!currentSong"
          >
            <SkipForward class="w-6 h-6" />
          </button>

          <button
            @click="toggleLike"
            class="p-2 hover:bg-white/[0.06] rounded-full transition-colors"
            :class="{ 'text-rose-500': currentSong && likedSongs.includes(currentSong.id), 'text-ink-secondary': !currentSong || !likedSongs.includes(currentSong.id) }"
          >
            <Heart class="w-5 h-5" :fill="currentSong && likedSongs.includes(currentSong.id) ? 'currentColor' : 'none'" />
          </button>
        </div>

        <!-- 音量控制 -->
        <div class="flex items-center gap-3 mt-6 w-full max-w-md">
          <button @click="playerStore.toggleMute" class="p-1 text-ink-secondary hover:text-white transition-colors">
            <VolumeX v-if="playerStore.isMuted" class="w-5 h-5" />
            <Volume2 v-else class="w-5 h-5" />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            :value="playerStore.isMuted ? 0 : playerStore.volume"
            @input="playerStore.setVolume(Number(($event.target as HTMLInputElement).value))"
            class="flex-1 h-1 bg-white/[0.08] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-400 [&::-webkit-slider-thumb]:shadow-md"
          />
        </div>

        <!-- 操作按钮 -->
        <div class="flex items-center gap-4 mt-6">
          <button class="flex items-center gap-2 px-4 py-2 bg-surface-200/50 hover:bg-surface-100 rounded-full transition-colors text-ink-secondary text-sm">
            <Share2 class="w-4 h-4" />
            <span>分享</span>
          </button>
          <button
            @click="currentSong && playerStore.addToPlaylist(currentSong)"
            class="flex items-center gap-2 px-4 py-2 bg-surface-200/50 hover:bg-surface-100 rounded-full transition-colors text-ink-secondary text-sm"
          >
            <ListMusic class="w-4 h-4" />
            <span>添加到歌单</span>
          </button>
        </div>
      </div>

      <!-- 评论区 -->
      <div class="bg-surface-200/50 rounded-2xl border border-white/5 p-6">
        <CommentSection v-if="currentSong" :song-id="currentSong.id" />
        <div v-else class="flex flex-col items-center justify-center h-96 text-ink-muted/30">
          <ListMusic class="w-16 h-16 mb-4" />
          <p>选择一首歌曲查看评论</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { mockSongs, getComments, submitComment } from '@/stores/data'
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

const audio = ref<HTMLAudioElement | null>(null)
const currentSong = ref<Song | null>(null)
const isDragging = ref(false)
const likedSongs = ref<number[]>([])

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
    const song = mockSongs.find(s => s.id === Number(id))
    if (song) {
      currentSong.value = song
      playerStore.setCurrentSong(song, mockSongs)
    }
  }
}, { immediate: true })

watch(() => playerStore.currentSong, (song) => {
  if (song) {
    currentSong.value = song
  }
}, { immediate: true })

watch(() => playerStore.isPlaying, (playing) => {
  if (audio.value) {
    playing ? audio.value.play() : audio.value.pause()
  }
})

watch(() => playerStore.volume, (volume) => {
  if (audio.value) {
    audio.value.volume = volume
  }
})

watch(() => playerStore.isMuted, (muted) => {
  if (audio.value) {
    audio.value.muted = muted
  }
})

onMounted(() => {
  if (audio.value) {
    audio.value.volume = playerStore.volume
    audio.value.muted = playerStore.isMuted
  }
})

function handleTimeUpdate() {
  if (audio.value && !isDragging.value) {
    playerStore.setProgress(audio.value.currentTime)
  }
}

function handleLoadedMetadata() {
  if (audio.value) {
    playerStore.setDuration(audio.value.duration)
  }
}

function handleEnded() {
  playerStore.playNext()
}

function handleProgressClick(event: MouseEvent) {
  if (!audio.value) return
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  const time = percent * playerStore.duration
  audio.value.currentTime = time
  playerStore.setProgress(time)
}

function handleVolumeChange(event: Event) {
  const target = event.target as HTMLInputElement
  playerStore.setVolume(Number(target.value))
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
  <div class="container mx-auto px-4 py-8">
    <!-- Back Button -->
    <button
      @click="goBack"
      class="flex items-center gap-2 text-earth-400 hover:text-primary transition-colors mb-6"
    >
      <ArrowLeft class="w-5 h-5" />
      <span>返回</span>
    </button>

    <div class="grid lg:grid-cols-2 gap-8">
      <!-- Player Section -->
      <div class="flex flex-col items-center">
        <!-- Album Cover -->
        <div class="relative mb-8">
          <div class="absolute inset-0 gradient-primary rounded-full opacity-20 blur-3xl"></div>
          <div class="relative">
            <div class="w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-2xl" :class="{ 'animate-spin-slow': playerStore.isPlaying }">
              <img
                v-if="currentSong"
                :src="currentSong.cover"
                :alt="currentSong.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full bg-earth-800 flex items-center justify-center">
                <Disc3 class="w-24 h-24 text-earth-500" />
              </div>
            </div>
            <!-- Glow effect when playing -->
            <div
              v-if="playerStore.isPlaying"
              class="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse"
            ></div>
          </div>
        </div>

        <!-- Song Info -->
        <div class="text-center mb-8 w-full max-w-md">
          <h1 class="text-2xl sm:text-3xl font-bold mb-2">
            {{ currentSong?.name || '未选择歌曲' }}
          </h1>
          <p class="text-earth-400">
            {{ currentSong?.artist || '请选择一首歌曲播放' }}
          </p>
        </div>

        <!-- Progress Bar -->
        <div class="w-full max-w-md mb-6">
          <div
            class="h-1 bg-earth-700 rounded-full cursor-pointer group"
            @click="handleProgressClick"
          >
            <div
              class="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full relative transition-all"
              :style="{ width: `${playerStore.progress}%` }"
            >
              <div class="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
          <div class="flex justify-between mt-2 text-xs text-earth-500">
            <span>{{ formatTime(playerStore.currentTime) }}</span>
            <span>{{ formatTime(playerStore.duration) }}</span>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex items-center gap-4 sm:gap-6">
          <button
            @click="togglePlayMode"
            class="p-2 hover:bg-white/10 rounded-full transition-colors"
            :title="playModeText"
          >
            <component :is="playModeIcon" class="w-5 h-5" />
          </button>

          <button
            @click="playerStore.playPrev"
            class="p-3 hover:bg-white/10 rounded-full transition-colors"
            :disabled="!currentSong"
          >
            <SkipBack class="w-6 h-6" />
          </button>

          <button
            @click="playerStore.togglePlay"
            class="w-16 h-16 rounded-full gradient-primary flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-primary/30"
            :disabled="!currentSong"
          >
            <Pause v-if="playerStore.isPlaying" class="w-8 h-8 text-white" />
            <Play v-else class="w-8 h-8 text-white ml-1" />
          </button>

          <button
            @click="playerStore.playNext"
            class="p-3 hover:bg-white/10 rounded-full transition-colors"
            :disabled="!currentSong"
          >
            <SkipForward class="w-6 h-6" />
          </button>

          <button
            @click="toggleLike"
            class="p-2 hover:bg-white/10 rounded-full transition-colors"
            :class="{ 'text-red-500': currentSong && likedSongs.includes(currentSong.id) }"
          >
            <Heart class="w-5 h-5" :fill="currentSong && likedSongs.includes(currentSong.id) ? 'currentColor' : 'none'" />
          </button>
        </div>

        <!-- Volume -->
        <div class="flex items-center gap-3 mt-6 w-full max-w-md">
          <button @click="playerStore.toggleMute" class="p-1">
            <VolumeX v-if="playerStore.isMuted" class="w-5 h-5" />
            <Volume2 v-else class="w-5 h-5" />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            :value="playerStore.isMuted ? 0 : playerStore.volume"
            @input="handleVolumeChange"
            class="flex-1 h-1 bg-earth-600 rounded-full appearance-none cursor-pointer accent-primary"
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-4 mt-6">
          <button class="flex items-center gap-2 px-4 py-2 bg-earth-700/50 hover:bg-earth-600/50 rounded-full transition-colors text-earth-200">
            <Share2 class="w-4 h-4" />
            <span class="text-sm">分享</span>
          </button>
          <button class="flex items-center gap-2 px-4 py-2 bg-earth-700/50 hover:bg-earth-600/50 rounded-full transition-colors text-earth-200">
            <ListMusic class="w-4 h-4" />
            <span class="text-sm">添加到歌单</span>
          </button>
        </div>
      </div>

      <!-- Comments Section -->
      <div class="bg-earth-800/50 rounded-2xl border border-earth-700/50 p-6">
        <CommentSection v-if="currentSong" :song-id="currentSong.id" />
        <div v-else class="flex flex-col items-center justify-center h-96 text-earth-400">
          <ListMusic class="w-16 h-16 mb-4" />
          <p>选择一首歌曲查看评论</p>
        </div>
      </div>
    </div>

    <!-- Hidden Audio -->
    <audio
      ref="audio"
      :src="currentSong?.audio"
      @timeupdate="handleTimeUpdate"
      @loadedmetadata="handleLoadedMetadata"
      @ended="handleEnded"
    ></audio>
  </div>
</template>

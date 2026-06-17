<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { Play, Pause, Clock, Plus, Heart } from 'lucide-vue-next'
import type { Song } from '@/stores/types'

const props = defineProps<{
  song: Song
  index?: number
}>()

const router = useRouter()
const playerStore = usePlayerStore()

const isCurrentSong = computed(() => playerStore.currentSong?.id === props.song.id)
const isPlaying = computed(() => isCurrentSong.value && playerStore.isPlaying)

function handlePlay() {
  if (isCurrentSong.value) {
    playerStore.togglePlay()
  } else {
    playerStore.setCurrentSong(props.song)
  }
}

function handleGoToPlayer() {
  router.push(`/player/${props.song.id}`)
}

function handleAddToPlaylist(event: Event) {
  event.stopPropagation()
  playerStore.addToPlaylist(props.song)
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<template>
  <div
    class="group bg-earth-800/50 rounded-xl overflow-hidden border border-earth-700/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 cursor-pointer card-hover"
    @click="handlePlay"
  >
    <!-- Cover -->
    <div class="relative aspect-square overflow-hidden">
      <img
        :src="song.cover"
        :alt="song.name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        :class="{ 'scale-110': isPlaying }"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      
      <!-- Play Button Overlay -->
      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          class="w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform"
          @click.stop="handlePlay"
        >
          <Pause v-if="isPlaying" class="w-7 h-7 text-white" />
          <Play v-else class="w-7 h-7 text-white ml-1" />
        </button>
      </div>

      <!-- Playing Indicator -->
      <div
        v-if="isPlaying"
        class="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-primary/80 rounded-full"
      >
        <div class="w-1 h-3 bg-white rounded-full animate-pulse"></div>
        <div class="w-1 h-2 bg-white rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
        <div class="w-1 h-4 bg-white rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
      </div>

      <!-- Actions -->
      <div class="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          @click="handleAddToPlaylist"
          class="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-primary transition-colors"
          title="添加到歌单"
        >
          <Plus class="w-4 h-4" />
        </button>
      </div>

      <!-- Duration -->
      <div class="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs">
        <Clock class="w-3 h-3" />
        {{ formatTime(song.duration) }}
      </div>
    </div>

    <!-- Info -->
    <div class="p-3">
      <h3
        class="font-medium text-sm truncate mb-1 transition-colors"
        :class="{ 'text-primary': isCurrentSong }"
      >
        {{ song.name }}
      </h3>
      <p class="text-xs text-muted-foreground truncate">{{ song.artist }}</p>
    </div>
  </div>
</template>

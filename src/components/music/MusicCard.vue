<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { Play, Pause, Plus } from 'lucide-vue-next'
import type { Song } from '@/stores/types'

const props = defineProps<{
  song: Song
  horizontal?: boolean
  index?: number
}>()

const router = useRouter()
const playerStore = usePlayerStore()

const isCurrentSong = computed(() => playerStore.currentSong?.id === props.song.id)
const isPlaying = computed(() => isCurrentSong.value && playerStore.isPlaying)

function handlePlay(e: Event) {
  e.stopPropagation()
  if (isCurrentSong.value) {
    playerStore.togglePlay()
  } else {
    playerStore.setCurrentSong(props.song)
  }
}

function handleClick() {
  router.push(`/player/${props.song.id}`)
}

function handleAddToPlaylist(e: Event) {
  e.stopPropagation()
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
    class="group rounded-xl overflow-hidden border border-white/5 bg-surface-200 hover:bg-surface-100 transition-all duration-300 cursor-pointer"
    :class="{
      'hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/10': !horizontal,
      'flex items-center gap-4': horizontal,
    }"
    @click="handleClick"
  >
    <!-- 封面区 -->
    <div 
      class="cover-mask relative overflow-hidden"
      :class="horizontal ? 'w-24 h-24 shrink-0 rounded-l-xl' : 'aspect-square w-full'"
    >
      <img
        :src="song.cover"
        :alt="song.name"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        :class="{ 'scale-110': isPlaying }"
      />
      
      <!-- 半透明蒙版 (去杂色) — cover-mask 的 ::after 负责 -->
      
      <!-- 播放覆盖层 -->
      <div class="play-overlay">
        <button
          @click="handlePlay"
          class="w-12 h-12 rounded-full bg-white/95 flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300"
        >
          <Pause v-if="isPlaying" class="w-5 h-5 text-primary-500" />
          <Play v-else class="w-5 h-5 text-primary-500 ml-0.5" />
        </button>
      </div>

      <!-- 正在播放指示器 -->
      <div
        v-if="isPlaying"
        class="absolute bottom-2 left-2 z-10 flex items-center gap-0.5 px-2 py-1 bg-primary-500/85 backdrop-blur-sm rounded-full"
      >
        <span class="w-0.5 h-2.5 bg-white rounded-full animate-[pulse_0.4s_ease-in-out_infinite]" style="height:60%"></span>
        <span class="w-0.5 bg-white rounded-full animate-[pulse_0.4s_ease-in-out_0.15s_infinite]" style="height:100%"></span>
        <span class="w-0.5 h-2 bg-white rounded-full animate-[pulse_0.4s_ease-in-out_0.3s_infinite]" style="height:40%"></span>
      </div>

      <!-- 操作按钮 -->
      <div class="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          @click="handleAddToPlaylist"
          class="w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-primary-500 transition-colors text-white"
          title="添加到歌单"
        >
          <Plus class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- 信息区 -->
    <div
      class="text-left"
      :class="horizontal ? 'flex-1 min-w-0 py-3 pr-4' : 'px-3 pb-3 pt-2.5'"
    >
      <p
        class="text-base font-medium truncate transition-colors duration-200"
        :class="isCurrentSong ? 'text-primary-300' : 'text-white group-hover:text-white'"
      >
        {{ song.name }}
      </p>
      <p class="text-sm text-ink-secondary truncate mt-0.5">{{ song.artist }}</p>
      <p v-if="horizontal" class="text-xs text-ink-muted truncate mt-1">{{ song.album }} · {{ formatTime(song.duration) }}</p>
    </div>
  </div>
</template>

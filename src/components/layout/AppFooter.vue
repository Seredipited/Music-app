<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerStore } from '@/stores/player'
import {
  Play, Pause, SkipBack, SkipForward,
  Volume2, VolumeX, Repeat, Repeat1, Shuffle,
  ListMusic, Heart, Disc3, GripHorizontal
} from 'lucide-vue-next'

const emit = defineEmits<{
  seek: [event: MouseEvent]
}>()

const playerStore = usePlayerStore()

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

function togglePlayMode() {
  const modes: Array<'sequence' | 'random' | 'loop'> = ['sequence', 'random', 'loop']
  const currentIndex = modes.indexOf(playerStore.playMode)
  const nextMode = modes[(currentIndex + 1) % modes.length]
  playerStore.setPlayMode(nextMode)
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<template>
  <footer class="shrink-0 glass-effect border-t border-white/5">
    <!-- Progress Bar -->
    <div
      class="h-0.5 bg-white/5 cursor-pointer group/progress relative"
      @click="emit('seek', $event)"
    >
      <div
        class="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-300 relative transition-all duration-150"
        :style="{ width: `${playerStore.progress}%` }"
      >
        <div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity shadow-md shadow-indigo-500/50"></div>
      </div>
    </div>

    <div class="px-4 sm:px-6 h-[72px] flex items-center gap-3 sm:gap-4">
      <!-- Song Info -->
      <div class="flex items-center gap-3 min-w-0 w-[220px]">
        <div
          v-if="playerStore.currentSong"
          class="relative shrink-0"
        >
          <!-- 迷你唱片 -->
          <div
            class="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 shadow-lg"
            :class="playerStore.isPlaying ? 'animate-spin-slow' : ''"
          >
            <img
              :src="playerStore.currentSong.cover"
              :alt="playerStore.currentSong.name"
              class="w-full h-full object-cover"
            />
          </div>
          <!-- 中心圆点 -->
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="w-3 h-3 rounded-full bg-vinyl-dark border border-white/10"></div>
          </div>
        </div>
        <div
          v-else
          class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/5"
        >
          <Disc3 class="w-5 h-5 text-white/20" />
        </div>
        <div class="min-w-0 hidden sm:block">
          <p class="text-sm font-medium truncate text-white/90">
            {{ playerStore.currentSong?.name || '未播放音乐' }}
          </p>
          <p class="text-xs text-white/40 truncate">
            {{ playerStore.currentSong?.artist || '选择一首歌曲开始' }}
          </p>
        </div>
      </div>

      <!-- Center Controls -->
      <div class="flex-1 flex flex-col items-center justify-center gap-1">
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Play Mode -->
          <button
            @click="togglePlayMode"
            class="p-1.5 rounded-full transition-colors text-white/40 hover:text-white/70 hover:bg-white/5 hidden sm:block"
            :title="playModeText"
          >
            <component :is="playModeIcon" class="w-4 h-4" />
          </button>

          <!-- Prev -->
          <button
            @click="playerStore.playPrev"
            class="p-1.5 rounded-full transition-colors text-white/50 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed"
            :disabled="!playerStore.currentSong"
          >
            <SkipBack class="w-[20px] h-[20px]" />
          </button>

          <!-- Play/Pause -->
          <button
            @click="playerStore.togglePlay"
            class="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
            :disabled="!playerStore.currentSong"
          >
            <Pause v-if="playerStore.isPlaying" class="w-5 h-5 text-white" />
            <Play v-else class="w-5 h-5 text-white ml-0.5" />
          </button>

          <!-- Next -->
          <button
            @click="playerStore.playNext"
            class="p-1.5 rounded-full transition-colors text-white/50 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed"
            :disabled="!playerStore.currentSong"
          >
            <SkipForward class="w-[20px] h-[20px]" />
          </button>

          <!-- Favorite -->
          <button
            class="p-1.5 rounded-full transition-colors text-white/40 hover:text-rose-400 hover:bg-white/5 hidden sm:block"
            title="收藏"
          >
            <Heart class="w-4 h-4" />
          </button>
        </div>

        <!-- Time + progress (compact) -->
        <div class="flex items-center gap-2 w-full max-w-[400px] sm:hidden">
          <span class="text-[10px] text-white/30 w-8 text-right">{{ formatTime(playerStore.currentTime) }}</span>
          <div class="flex-1 h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer" @click="emit('seek', $event)">
            <div
              class="h-full bg-indigo-500 rounded-full transition-all"
              :style="{ width: `${playerStore.progress}%` }"
            ></div>
          </div>
          <span class="text-[10px] text-white/30 w-8">{{ formatTime(playerStore.duration) }}</span>
        </div>
      </div>

      <!-- Right: Time / Volume / Playlist -->
      <div class="flex items-center gap-2 sm:gap-3 justify-end w-[220px]">
        <!-- Time (desktop) -->
        <div class="hidden sm:flex items-center gap-1 text-xs text-white/30">
          <span>{{ formatTime(playerStore.currentTime) }}</span>
          <span class="text-white/15">/</span>
          <span>{{ formatTime(playerStore.duration) }}</span>
        </div>

        <!-- Volume -->
        <button
          @click="playerStore.toggleMute"
          class="p-1.5 rounded-full transition-colors text-white/40 hover:text-white hover:bg-white/5"
        >
          <VolumeX v-if="playerStore.isMuted" class="w-4 h-4" />
          <Volume2 v-else class="w-4 h-4" />
        </button>

        <div class="w-20 hidden md:flex items-center">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            :value="playerStore.isMuted ? 0 : playerStore.volume"
            @input="playerStore.setVolume(Number(($event.target as HTMLInputElement).value))"
            class="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-400 [&::-webkit-slider-thumb]:shadow-md"
          />
        </div>

        <!-- Playlist Toggle -->
        <button
          @click="playerStore.togglePlaylist"
          class="p-1.5 rounded-full transition-colors relative text-white/40 hover:text-white hover:bg-white/5"
          :class="{ '!text-indigo-400': playerStore.isShowPlaylist }"
        >
          <ListMusic class="w-4 h-4" />
          <span
            v-if="playerStore.playlist.length > 0"
            class="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center leading-none px-1"
          >
            {{ playerStore.playlist.length }}
          </span>
        </button>
      </div>
    </div>

    <!-- Playlist Panel -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-full opacity-0"
    >
      <div
        v-if="playerStore.isShowPlaylist"
        class="absolute bottom-full left-0 right-0 h-80 gradient-bg border-t border-white/10 rounded-t-xl shadow-[0_-8px_32px_rgba(0,0,0,0.4)] overflow-hidden z-10"
      >
        <div class="flex items-center justify-between px-5 py-3 border-b border-white/5">
          <h3 class="font-semibold text-sm text-white/80">播放列表</h3>
          <button @click="playerStore.togglePlaylist" class="p-1 rounded-full hover:bg-white/5 text-white/40 hover:text-white/80 transition-colors">
            <GripHorizontal class="w-4 h-4" />
          </button>
        </div>
        <div class="overflow-y-auto h-[calc(100%-48px)] scrollbar-hide">
          <div
            v-for="(song, index) in playerStore.playlist"
            :key="song.id"
            @click="playerStore.setCurrentSong(song)"
            class="flex items-center gap-3 px-5 py-2.5 hover:bg-white/5 cursor-pointer transition-colors group"
            :class="{ 'bg-indigo-500/10': index === playerStore.currentIndex }"
          >
            <span class="text-xs text-white/30 w-5 text-center shrink-0" :class="{ '!text-indigo-400 font-medium': index === playerStore.currentIndex }">
              {{ index + 1 }}
            </span>
            <img :src="song.cover" :alt="song.name" class="w-9 h-9 rounded object-cover shrink-0" />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium truncate" :class="index === playerStore.currentIndex ? 'text-indigo-300' : 'text-white/80'">
                {{ song.name }}
              </p>
              <p class="text-xs text-white/30 truncate">{{ song.artist }}</p>
            </div>
            <Play v-if="index === playerStore.currentIndex && playerStore.isPlaying" class="w-4 h-4 text-indigo-400 shrink-0 animate-pulse" />
          </div>
          <div v-if="playerStore.playlist.length === 0" class="flex flex-col items-center justify-center h-full text-white/15 py-8">
            <ListMusic class="w-10 h-10 mb-2 opacity-30" />
            <p class="text-sm">播放列表为空</p>
          </div>
        </div>
      </div>
    </Transition>
  </footer>
</template>

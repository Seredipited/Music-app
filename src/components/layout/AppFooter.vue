<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { 
  Play, Pause, SkipBack, SkipForward, 
  Volume2, VolumeX, Repeat, Repeat1, Shuffle,
  ListMusic, X, Heart
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
  <footer class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
    <!-- Progress Bar -->
    <div 
      class="h-1 bg-[#ebeef5] cursor-pointer group"
      @click="emit('seek', $event)"
    >
      <div 
        class="h-full bg-gradient-to-r from-[#409eff] to-[#66b1ff] relative transition-all"
        :style="{ width: `${playerStore.progress}%` }"
      >
        <div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md border border-[#409eff]"></div>
      </div>
    </div>

    <div class="px-6 h-16 flex items-center gap-4">
      <!-- Song Info -->
      <div class="flex items-center gap-3 min-w-0 flex-1">
        <div v-if="playerStore.currentSong" class="relative group/cover">
          <img
            :src="playerStore.currentSong.cover"
            :alt="playerStore.currentSong.name"
            class="w-11 h-11 rounded object-cover shadow-sm"
            :class="{ 'animate-spin-slow': playerStore.isPlaying }"
          />
          <div class="absolute inset-0 bg-black/30 rounded opacity-0 group-hover/cover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <Heart class="w-4 h-4 text-red-500 fill-red-500" />
          </div>
        </div>
        <div v-else class="w-11 h-11 rounded bg-gray-100 flex items-center justify-center">
          <ListMusic class="w-5 h-5 text-gray-300" />
        </div>
        <div class="min-w-0 hidden sm:block">
          <h4 class="font-medium text-sm truncate text-[#303133]">
            {{ playerStore.currentSong?.name || '未播放音乐' }}
          </h4>
          <p class="text-xs text-[#909399] truncate">
            {{ playerStore.currentSong?.artist || '请选择一首歌曲' }}
          </p>
        </div>
      </div>

      <!-- Controls -->
      <div class="flex items-center gap-2 sm:gap-3">
        <button
          @click="playerStore.playPrev"
          class="p-1.5 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-40 text-[#606266] hover:text-[#409eff]"
          :disabled="!playerStore.currentSong"
        >
          <SkipBack class="w-[18px] h-[18px]" />
        </button>
        
        <button
          @click="playerStore.togglePlay"
          class="w-9 h-9 rounded-full gradient-primary flex items-center justify-center hover:shadow-md transition-transform hover:scale-105 disabled:opacity-50"
          :disabled="!playerStore.currentSong"
        >
          <Pause v-if="playerStore.isPlaying" class="w-4 h-4 text-white" />
          <Play v-else class="w-4 h-4 text-white ml-0.5" />
        </button>
        
        <button
          @click="playerStore.playNext"
          class="p-1.5 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-40 text-[#606266] hover:text-[#409eff]"
          :disabled="!playerStore.currentSong"
        >
          <SkipForward class="w-[18px] h-[18px]" />
        </button>
      </div>

      <!-- Time & Volume -->
      <div class="flex items-center gap-3 flex-1 justify-end">
        <div class="text-xs text-[#909399] hidden sm:block">
          <span>{{ formatTime(playerStore.currentTime) }}</span>
          <span class="mx-0.5">/</span>
          <span>{{ formatTime(playerStore.duration) }}</span>
        </div>

        <button
          @click="togglePlayMode"
          class="p-1.5 hover:bg-blue-50 rounded-full transition-colors hidden sm:block text-[#606266] hover:text-[#409eff]"
          :title="playModeText"
        >
          <component :is="playModeIcon" class="w-4 h-4" />
        </button>

        <button
          @click="playerStore.toggleMute"
          class="p-1.5 hover:bg-blue-50 rounded-full transition-colors text-[#606266] hover:text-[#409eff]"
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
            class="w-full h-1 bg-[#dcdfe6] rounded-full appearance-none cursor-pointer accent-[#409eff]"
          />
        </div>

        <button
          @click="playerStore.togglePlaylist"
          class="p-1.5 hover:bg-blue-50 rounded-full transition-colors relative text-[#606266] hover:text-[#409eff]"
          :class="{ 'text-[#409eff]': playerStore.isShowPlaylist }"
        >
          <ListMusic class="w-4 h-4" />
          <span 
            v-if="playerStore.playlist.length > 0"
            class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#f56c6c] text-white text-xs rounded-full flex items-center justify-center leading-none pt-[1px]"
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
        class="absolute bottom-full left-0 right-0 h-80 bg-white border-t border-gray-200 rounded-t-lg shadow-[0_-8px_24px_rgba(0,0,0,0.12)] overflow-hidden z-10"
      >
        <div class="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h3 class="font-semibold text-sm text-[#303133]">播放列表</h3>
          <button @click="playerStore.togglePlaylist" class="p-1 hover:bg-gray-100 rounded-full text-[#909399]">
            <X class="w-4 h-4" />
          </button>
        </div>
        <div class="overflow-y-auto h-[calc(100%-48px)] scrollbar-hide">
          <div
            v-for="(song, index) in playerStore.playlist"
            :key="song.id"
            @click="playerStore.setCurrentSong(song)"
            class="flex items-center gap-3 px-5 py-2 hover:bg-blue-50/70 cursor-pointer transition-colors"
            :class="{ 'bg-blue-50': index === playerStore.currentIndex }"
          >
            <img :src="song.cover" :alt="song.name" class="w-9 h-9 rounded object-cover" />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium truncate" :class="{ 'text-[#409eff]': index === playerStore.currentIndex }">
                {{ song.name }}
              </p>
              <p class="text-xs text-[#909399] truncate">{{ song.artist }}</p>
            </div>
          </div>
          <div v-if="playerStore.playlist.length === 0" class="flex flex-col items-center justify-center h-full text-[#c0c4cc] py-8">
            <ListMusic class="w-10 h-10 mb-2 opacity-50" />
            <p class="text-sm">播放列表为空</p>
          </div>
        </div>
      </div>
    </Transition>
  </footer>
</template>

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Song } from './types'

export type PlayMode = 'sequence' | 'random' | 'loop'

export const usePlayerStore = defineStore('player', () => {
  const currentSong = ref<Song | null>(null)
  const playlist = ref<Song[]>([])
  const currentIndex = ref(-1)
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(0.7)
  const playMode = ref<PlayMode>('sequence')
  const isMuted = ref(false)
  const isShowPlaylist = ref(false)

  // 音频元素引用（由 App.vue 注入）
  const audioEl = ref<HTMLAudioElement | null>(null)

  const progress = computed(() => {
    if (duration.value === 0) return 0
    return (currentTime.value / duration.value) * 100
  })

  const hasNext = computed(() => currentIndex.value < playlist.value.length - 1)
  const hasPrev = computed(() => currentIndex.value > 0)

  // 注册音频元素
  function registerAudio(el: HTMLAudioElement) {
    audioEl.value = el
    if (el) {
      el.volume = volume.value
      el.muted = isMuted.value
    }
  }

  // 卸载音频元素
  function unregisterAudio() {
    audioEl.value = null
  }

  // 同步音频状态
  function syncAudioState() {
    const audio = audioEl.value
    if (!audio) return

    if (currentSong.value && audio.src !== currentSong.value.audio) {
      audio.src = currentSong.value.audio
      audio.load()
    }

    if (isPlaying.value) {
      audio.play().catch(() => {
        // 浏览器可能阻止自动播放，静默处理
      })
    } else {
      audio.pause()
    }

    audio.volume = isMuted.value ? 0 : volume.value
    audio.muted = isMuted.value
  }

  // 监听状态变化同步音频
  watch(currentSong, () => syncAudioState())
  watch(isPlaying, () => syncAudioState())
  watch(volume, (v) => {
    if (audioEl.value && !isMuted.value) {
      audioEl.value.volume = v
    }
  })
  watch(isMuted, (m) => {
    if (audioEl.value) {
      audioEl.value.muted = m
    }
  })

  function setCurrentSong(song: Song, list: Song[] = []) {
    if (list.length > 0) {
      playlist.value = list
      currentIndex.value = list.findIndex(s => s.id === song.id)
    }
    currentSong.value = song
    currentTime.value = 0
    duration.value = song.duration
    isPlaying.value = true
  }

  function togglePlay() {
    if (!currentSong.value) return
    isPlaying.value = !isPlaying.value
  }

  function playNext() {
    if (playlist.value.length === 0) return

    if (playMode.value === 'random') {
      const randomIndex = Math.floor(Math.random() * playlist.value.length)
      currentIndex.value = randomIndex
    } else if (hasNext.value) {
      currentIndex.value++
    } else if (playMode.value === 'loop') {
      currentIndex.value = 0
    } else {
      isPlaying.value = false
      return
    }

    currentSong.value = playlist.value[currentIndex.value]
    duration.value = playlist.value[currentIndex.value].duration
    currentTime.value = 0
    isPlaying.value = true
  }

  function playPrev() {
    if (playlist.value.length === 0) return

    if (hasPrev.value) {
      currentIndex.value--
    } else {
      currentIndex.value = playlist.value.length - 1
    }

    currentSong.value = playlist.value[currentIndex.value]
    duration.value = playlist.value[currentIndex.value].duration
    currentTime.value = 0
    isPlaying.value = true
  }

  function setPlayMode(mode: PlayMode) {
    playMode.value = mode
  }

  function setProgress(time: number) {
    currentTime.value = time
  }

  function setDuration(d: number) {
    if (d && isFinite(d)) {
      duration.value = d
    }
  }

  function setVolume(v: number) {
    volume.value = Math.max(0, Math.min(1, v))
    if (v > 0) isMuted.value = false
  }

  function toggleMute() {
    isMuted.value = !isMuted.value
  }

  function togglePlaylist() {
    isShowPlaylist.value = !isShowPlaylist.value
  }

  function addToPlaylist(song: Song) {
    if (!playlist.value.find(s => s.id === song.id)) {
      playlist.value.push(song)
    }
  }

  function removeFromPlaylist(songId: number) {
    const index = playlist.value.findIndex(s => s.id === songId)
    if (index > -1) {
      playlist.value.splice(index, 1)
      if (currentIndex.value >= index && currentIndex.value > 0) {
        currentIndex.value--
      }
    }
  }

  function clearPlaylist() {
    playlist.value = []
    currentIndex.value = -1
    currentSong.value = null
    isPlaying.value = false
  }

  return {
    currentSong,
    playlist,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    playMode,
    isMuted,
    isShowPlaylist,
    progress,
    hasNext,
    hasPrev,
    audioEl,
    registerAudio,
    unregisterAudio,
    syncAudioState,
    setCurrentSong,
    togglePlay,
    playNext,
    playPrev,
    setPlayMode,
    setProgress,
    setDuration,
    setVolume,
    toggleMute,
    togglePlaylist,
    addToPlaylist,
    removeFromPlaylist,
    clearPlaylist
  }
})

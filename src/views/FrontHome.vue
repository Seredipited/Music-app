<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { mockSongs } from '@/stores/data'
import { Play, Pause, Disc3, Flame, TrendingUp, Clock, Music2 } from 'lucide-vue-next'
import type { Song } from '@/stores/types'

const playerStore = usePlayerStore()
const allSongs = ref<Song[]>([])
const activeSongId = ref<number | null>(null)

// 推荐歌曲取前12首
const recommendedSongs = computed(() => allSongs.value.slice(0, 12))
// 热门歌曲取全部
const hotSongs = computed(() => allSongs.value)

// Hero 大封面对应的歌曲
const heroSong = computed(() => allSongs.value[0] || null)

onMounted(() => {
  // 模拟延迟加载，触发入场动画
  setTimeout(() => {
    allSongs.value = [...mockSongs]
  }, 100)
})

function handlePlaySong(song: Song) {
  activeSongId.value = song.id
  playerStore.setCurrentSong(song, allSongs.value)
}

function handleTogglePlay() {
  playerStore.togglePlay()
  if (playerStore.currentSong) {
    activeSongId.value = playerStore.currentSong.id
  }
}

function handlePlayHero() {
  if (!heroSong.value) return
  if (playerStore.currentSong?.id === heroSong.value.id) {
    playerStore.togglePlay()
  } else {
    handlePlaySong(heroSong.value)
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function isCurrentSong(songId: number) {
  return playerStore.currentSong?.id === songId
}

function isPlayingSong(songId: number) {
  return isCurrentSong(songId) && playerStore.isPlaying
}

// 获取推荐区网格的入场动画类名
function gridAnimClass(index: number): string {
  const anims = [
    'animate-slide-up-d1', 'animate-slide-up-d2', 'animate-slide-up-d3',
    'animate-slide-up-d4', 'animate-slide-up-d5', 'animate-slide-up',
    'animate-slide-up-d1', 'animate-slide-up-d2', 'animate-slide-up-d3',
    'animate-slide-up-d4', 'animate-slide-up-d5', 'animate-slide-up',
  ]
  return anims[index] || 'animate-slide-up'
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
    <!-- ==================== Hero 英雄区 ==================== -->
    <section class="relative overflow-hidden rounded-2xl hero-gradient border border-white/5 mb-10 mt-6">
      <!-- 舞台灯效：右上角超大模糊圆 -->
      <div class="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>
      <div class="absolute top-20 right-60 w-[300px] h-[300px] rounded-full bg-purple-500/10 blur-3xl pointer-events-none"></div>
      <!-- 左下氛围光 -->
      <div class="absolute -bottom-20 -left-20 w-[350px] h-[350px] rounded-full bg-indigo-600/8 blur-3xl pointer-events-none"></div>

      <div class="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-16 p-8 sm:p-12 lg:p-16">
        <!-- 左侧：大封面 -->
        <div class="relative shrink-0">
          <div
            class="w-52 h-52 sm:w-64 sm:h-64 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-900/40 border border-white/10"
            :class="{ 'animate-float': !playerStore.isPlaying }"
          >
            <img
              v-if="heroSong"
              :src="heroSong.cover"
              :alt="heroSong.name"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full bg-white/5 flex items-center justify-center"
            >
              <Music2 class="w-16 h-16 text-white/10" />
            </div>
          </div>
        </div>

        <!-- 中间：旋转唱片 -->
        <div class="relative shrink-0 flex items-center justify-center">
          <!-- 脉冲光晕 -->
          <div
            class="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full animate-pulse-glow pointer-events-none"
          ></div>
          <!-- 呼吸光晕 — 更外层 -->
          <div
            class="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full animate-pulse-glow-slow pointer-events-none opacity-60"
          ></div>

          <!-- 唱片主体 -->
          <div
            class="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full"
            :class="{ 'animate-spin-slow': playerStore.isPlaying }"
          >
            <!-- 唱片底纹 -->
            <div
              class="absolute inset-0 rounded-full vinyl-texture bg-vinyl shadow-2xl shadow-indigo-900/30 border-2 border-white/5"
            ></div>
            <!-- 封面贴片 -->
            <div
              v-if="heroSong"
              class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-white/10 z-10"
            >
              <img :src="heroSong.cover" :alt="heroSong.name" class="w-full h-full object-cover" />
            </div>
            <!-- 中心轴孔 -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-vinyl-dark border border-white/10 z-20"></div>
            <!-- 唱片沟槽线 -->
            <div class="absolute inset-[15%] rounded-full border border-white/[0.03] opacity-50 pointer-events-none"></div>
            <div class="absolute inset-[30%] rounded-full border border-white/[0.03] opacity-40 pointer-events-none"></div>
            <div class="absolute inset-[45%] rounded-full border border-white/[0.025] opacity-30 pointer-events-none"></div>
          </div>

          <!-- 唱臂装饰 -->
          <div
            class="absolute -top-2 right-[-10px] w-1.5 h-20 bg-gradient-to-b from-white/40 to-white/10 rounded-full origin-top transform rotate-[25deg] pointer-events-none hidden sm:block"
            style="transform-origin: top center;"
          >
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white/30"></div>
          </div>
        </div>

        <!-- 右侧：文案 + 操作 -->
        <div class="flex-1 text-center lg:text-left">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 text-glow leading-tight">
            发现好音乐
          </h1>
          <p class="text-white/50 text-sm sm:text-base max-w-md mb-6 mx-auto lg:mx-0 leading-relaxed">
            探索海量华语金曲，沉浸式黑胶唱片体验，随时随地畅听你喜爱的音乐。
          </p>
          <div class="flex flex-wrap items-center gap-3 justify-center lg:justify-start">
            <button
              v-if="!playerStore.isPlaying || playerStore.currentSong?.id !== heroSong?.id"
              @click="handlePlayHero"
              class="px-7 py-3 gradient-primary rounded-full font-medium text-white flex items-center gap-2.5 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:scale-105 active:scale-95"
              :disabled="!heroSong"
            >
              <Play class="w-5 h-5" fill="currentColor" />
              立即播放
            </button>
            <button
              v-else
              @click="handleTogglePlay"
              class="px-7 py-3 gradient-primary rounded-full font-medium text-white flex items-center gap-2.5 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:scale-105 active:scale-95"
            >
              <Pause class="w-5 h-5" fill="currentColor" />
              暂停播放
            </button>
            <span v-if="heroSong" class="text-sm text-white/30">
              {{ heroSong.name }} — {{ heroSong.artist }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== 为你推荐 — 2×6 宫格 ==================== -->
    <section class="mb-12">
      <!-- 标题栏 -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-white flex items-center gap-2.5">
          <Disc3 class="w-5 h-5 text-indigo-400" />
          为你推荐
        </h2>
        <div class="flex items-center gap-2 text-xs text-white/30">
          <TrendingUp class="w-3.5 h-3.5" />
          <span>共 {{ recommendedSongs.length }} 首</span>
        </div>
      </div>

      <!-- 2×6 宫格 -->
      <div
        v-if="recommendedSongs.length > 0"
        class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-5"
      >
        <div
          v-for="(song, index) in recommendedSongs"
          :key="song.id"
          :class="gridAnimClass(index)"
          class="flex flex-col items-center gap-2.5 cursor-pointer group"
          @click="handlePlaySong(song)"
        >
          <!-- 封面图片 — 无卡片包裹，仅圆角方形 -->
          <div class="relative w-full aspect-square rounded-xl overflow-hidden shadow-lg shadow-black/20 group-hover:shadow-indigo-500/20 transition-all duration-300">
            <img
              :src="song.cover"
              :alt="song.name"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              :class="{ 'scale-105': isCurrentSong(song.id) }"
            />

            <!-- Hover 播放遮罩 -->
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
              <div class="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100 shadow-lg">
                <Pause
                  v-if="isPlayingSong(song.id)"
                  class="w-5 h-5 text-indigo-600"
                />
                <Play
                  v-else
                  class="w-5 h-5 text-indigo-600 ml-0.5"
                />
              </div>
            </div>

            <!-- 正在播放指示器 -->
            <div
              v-if="isPlayingSong(song.id)"
              class="absolute top-2 right-2 flex items-center gap-0.5 px-2 py-1 bg-indigo-500/90 backdrop-blur-sm rounded-full"
            >
              <span class="w-0.5 h-2.5 bg-white rounded-full animate-pulse"></span>
              <span class="w-0.5 h-2 bg-white rounded-full animate-pulse" style="animation-delay: 0.15s"></span>
              <span class="w-0.5 h-3 bg-white rounded-full animate-pulse" style="animation-delay: 0.3s"></span>
              <span class="w-0.5 h-2 bg-white rounded-full animate-pulse" style="animation-delay: 0.45s"></span>
            </div>
          </div>

          <!-- 歌名 & 歌手 -->
          <div class="w-full min-w-0 text-center">
            <p
              class="text-sm font-medium truncate transition-colors duration-200"
              :class="isCurrentSong(song.id) ? 'text-indigo-400' : 'text-white/80 group-hover:text-white'"
            >
              {{ song.name }}
            </p>
            <p class="text-xs text-white/30 truncate mt-0.5">{{ song.artist }}</p>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div
        v-else
        class="text-center py-16 text-white/20"
      >
        <Disc3 class="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p class="text-sm">暂无推荐歌曲</p>
      </div>
    </section>

    <!-- ==================== 热门歌曲 — 表格列表 ==================== -->
    <section>
      <!-- 标题栏 -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-white flex items-center gap-2.5">
          <Flame class="w-5 h-5 text-indigo-400" />
          热门歌曲
        </h2>
        <span class="text-xs text-white/30">{{ hotSongs.length }} 首歌</span>
      </div>

      <!-- 表格 -->
      <div
        v-if="hotSongs.length > 0"
        class="overflow-hidden rounded-xl border border-white/5"
      >
        <!-- 表头 -->
        <div class="flex items-center px-4 sm:px-6 py-3 text-xs font-medium text-white/30 bg-white/[0.02] border-b border-white/5">
          <span class="w-10 text-center shrink-0">#</span>
          <span class="flex-1 min-w-0 pl-2">歌曲</span>
          <span class="w-32 hidden sm:block shrink-0">歌手</span>
          <span class="w-40 hidden md:block shrink-0">专辑</span>
          <span class="w-20 text-right shrink-0">
            <Clock class="w-3.5 h-3.5 inline-block" />
          </span>
        </div>

        <!-- 表体 -->
        <div class="table-stripe">
          <div
            v-for="(song, index) in hotSongs"
            :key="song.id"
            class="flex items-center px-4 sm:px-6 py-2.5 transition-all duration-150 cursor-pointer group/row"
            :class="[
              isCurrentSong(song.id)
                ? 'bg-indigo-500/10'
                : 'hover:bg-white/[0.04]',
              `animate-fade-in-d${Math.min((index % 3) + 1, 3)}`
            ]"
            @click="handlePlaySong(song)"
          >
            <!-- 序号 / 播放图标 -->
            <span class="w-10 text-center shrink-0">
              <span
                v-if="isPlayingSong(song.id)"
                class="inline-flex items-center justify-center"
              >
                <span class="flex items-end gap-px h-3">
                  <span class="w-0.5 bg-indigo-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite]" style="height:60%"></span>
                  <span class="w-0.5 bg-indigo-400 rounded-full animate-[pulse_0.4s_ease-in-out_0.15s_infinite]" style="height:100%"></span>
                  <span class="w-0.5 bg-indigo-400 rounded-full animate-[pulse_0.4s_ease-in-out_0.3s_infinite]" style="height:40%"></span>
                </span>
              </span>
              <span
                v-else
                class="text-sm"
                :class="isCurrentSong(song.id) ? 'text-indigo-400 font-medium' : 'text-white/30 group-hover/row:text-white/60'"
              >
                {{ index + 1 }}
              </span>
            </span>

            <!-- 歌曲信息 -->
            <div class="flex-1 min-w-0 flex items-center gap-3 pl-2">
              <img
                :src="song.cover"
                :alt="song.name"
                class="w-10 h-10 rounded-lg object-cover shrink-0 shadow-md transition-transform duration-300 group-hover/row:scale-105"
              />
              <div class="min-w-0">
                <p
                  class="text-sm font-medium truncate transition-colors duration-200"
                  :class="isCurrentSong(song.id) ? 'text-indigo-400' : 'text-white/80 group-hover/row:text-white'"
                >
                  {{ song.name }}
                </p>
                <p class="text-xs text-white/30 truncate sm:hidden">{{ song.artist }}</p>
              </div>
            </div>

            <!-- 歌手 -->
            <span class="w-32 hidden sm:block shrink-0 text-sm text-white/40 truncate group-hover/row:text-white/60 transition-colors">
              {{ song.artist }}
            </span>

            <!-- 专辑 -->
            <span class="w-40 hidden md:block shrink-0 text-sm text-white/25 truncate group-hover/row:text-white/45 transition-colors">
              {{ song.album }}
            </span>

            <!-- 时长 -->
            <span class="w-20 text-right shrink-0 text-sm text-white/25 group-hover/row:text-white/45 transition-colors">
              {{ formatTime(song.duration) }}
            </span>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div
        v-else
        class="text-center py-16 text-white/20"
      >
        <Flame class="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p class="text-sm">暂无热门歌曲</p>
      </div>
    </section>
  </div>
</template>

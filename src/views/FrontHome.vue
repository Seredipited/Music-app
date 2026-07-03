<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { mockSongs } from '@/stores/data'
import { Play, Pause, Disc3, Flame, Clock, Music2 } from 'lucide-vue-next'
import type { Song } from '@/stores/types'
import MusicCard from '@/components/music/MusicCard.vue'

const playerStore = usePlayerStore()
const allSongs = ref<Song[]>([])

// 推荐歌曲取前12首
const recommendedSongs = computed(() => allSongs.value.slice(0, 12))
// 热门歌曲取全部
const hotSongs = computed(() => allSongs.value)

// Hero 大封面对应的歌曲
const heroSong = computed(() => allSongs.value[0] || null)

// ---------- 滚动入场动画 ----------
const revealedSections = ref(new Set<number>())
let observer: IntersectionObserver | null = null

onMounted(() => {
  // 模拟延迟加载，触发入场动画
  setTimeout(() => {
    allSongs.value = [...mockSongs]
  }, 100)

  // 滚动入场观察器
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number((entry.target as HTMLElement).dataset.revealIndex)
          if (!isNaN(index)) {
            revealedSections.value.add(index)
            revealedSections.value = new Set(revealedSections.value)
          }
          observer?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  )

  // 观察滚动动画元素
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    observer?.observe(el)
  })
})

onUnmounted(() => {
  observer?.disconnect()
})

function isRevealed(index: number): boolean {
  return revealedSections.value.has(index)
}

// ---------- 播放逻辑 ----------
function handlePlaySong(song: Song, list?: Song[]) {
  playerStore.setCurrentSong(song, list || allSongs.value)
}

function handleTogglePlay() {
  playerStore.togglePlay()
}

function handlePlayHero() {
  if (!heroSong.value) return
  if (playerStore.currentSong?.id === heroSong.value.id) {
    playerStore.togglePlay()
  } else {
    handlePlaySong(heroSong.value)
  }
}

// ---------- 工具函数 ----------
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

// 网格卡片入场动画
function gridAnimClass(index: number): string {
  const anims = [
    'animate-slide-in-up-d1', 'animate-slide-in-up-d2',
    'animate-slide-in-up-d3', 'animate-slide-in-up-d4',
    'animate-slide-in-up-d5', 'animate-slide-in-up-d6',
  ]
  return anims[index % anims.length] || 'animate-slide-in-up'
}

// 是否显示横向大卡片（每隔6张出现一张占两格大卡片）
function isLargeCard(index: number): boolean {
  return index === 5 || index === 11
}
</script>

<template>
  <div class="px-6 lg:px-10 pb-8 pt-6 space-y-12">
    <!-- ==================== Hero 英雄区 — 破界唱片 ==================== -->
    <section
      data-reveal
      :data-reveal-index="0"
      class="relative overflow-visible rounded-2xl hero-gradient border border-white/5"
      :class="{ 'animate-slide-in-up': isRevealed(0) }"
    >
      <!-- 舞台灯效 — 多层模糊光晕 -->
      <div class="absolute -top-32 -right-32 w-[450px] h-[450px] rounded-full bg-primary-500/15 blur-[80px] pointer-events-none"></div>
      <div class="absolute top-16 right-48 w-[250px] h-[250px] rounded-full bg-primary-400/8 blur-[60px] pointer-events-none"></div>
      <div class="absolute -bottom-16 -left-16 w-[300px] h-[300px] rounded-full bg-primary-600/6 blur-[70px] pointer-events-none"></div>

      <div class="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 px-8 sm:px-12 lg:px-16 py-10 lg:py-14">
        <!-- 左侧：大封面 — 破界探出 -->
        <div class="relative shrink-0 -mt-12 lg:-mt-16 z-20">
          <div
            class="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-2xl shadow-primary-900/40 border-2 border-white/10"
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
              class="w-full h-full bg-white/[0.03] flex items-center justify-center"
            >
              <Music2 class="w-14 h-14 text-white/5" />
            </div>
          </div>
        </div>

        <!-- 中间：黑胶唱片 — 破界探出 + 发光晕 -->
        <div class="relative shrink-0 flex items-center justify-center z-10 -mt-4 lg:-mt-8">
          <!-- 发光晕 — 播放时更强 -->
          <div
            class="absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full pointer-events-none"
            :class="playerStore.isPlaying ? 'animate-vinyl-glow' : 'animate-pulse-glow'"
          ></div>

          <!-- 唱片主体 -->
          <div
            class="relative w-52 h-52 sm:w-60 sm:h-60 rounded-full will-change-transform"
            :class="{ 'animate-spin-slow': playerStore.isPlaying }"
          >
            <!-- 唱片底纹 -->
            <div
              class="absolute inset-0 rounded-full vinyl-texture bg-vinyl shadow-2xl shadow-primary-900/30 border-2 border-white/[0.04]"
            ></div>
            <!-- 封面贴片 -->
            <div
              v-if="heroSong"
              class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45%] h-[45%] rounded-full overflow-hidden border-2 border-white/[0.06] z-10"
            >
              <img :src="heroSong.cover" :alt="heroSong.name" class="w-full h-full object-cover" />
            </div>
            <!-- 中心轴孔 -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#161d31] border border-white/[0.08] z-20"></div>
            <!-- 沟槽线 -->
            <div class="absolute inset-[12%] rounded-full border border-white/[0.02] opacity-40 pointer-events-none"></div>
            <div class="absolute inset-[28%] rounded-full border border-white/[0.02] opacity-30 pointer-events-none"></div>
            <div class="absolute inset-[44%] rounded-full border border-white/[0.015] opacity-20 pointer-events-none"></div>
          </div>

          <!-- 唱臂装饰 -->
          <div
            class="absolute -top-1 right-[-8px] w-1 h-16 bg-gradient-to-b from-white/30 to-white/8 rounded-full origin-top transform rotate-[25deg] pointer-events-none hidden sm:block"
            style="transform-origin: top center;"
          >
            <div class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-white/20"></div>
          </div>
        </div>

        <!-- 右侧：文案 + CTA -->
        <div class="flex-1 text-left z-10">
          <h1 class="text-5xl font-bold text-white mb-3 text-glow leading-tight">
            发现好音乐
          </h1>
          <p class="text-ink-secondary text-base max-w-md leading-relaxed mb-6">
            探索海量华语金曲，沉浸式黑胶唱片体验，<br />随时随地畅听你喜爱的音乐。
          </p>
          <div class="flex flex-wrap items-center gap-3">
            <button
              v-if="!playerStore.isPlaying || playerStore.currentSong?.id !== heroSong?.id"
              @click="handlePlayHero"
              class="px-7 py-3 gradient-primary rounded-full font-medium text-white flex items-center gap-2.5 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/45 transition-all hover:scale-105 active:scale-95"
              :disabled="!heroSong"
            >
              <Play class="w-5 h-5" fill="currentColor" />
              立即播放
            </button>
            <button
              v-else
              @click="handleTogglePlay"
              class="px-7 py-3 gradient-primary rounded-full font-medium text-white flex items-center gap-2.5 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/45 transition-all hover:scale-105 active:scale-95"
            >
              <Pause class="w-5 h-5" fill="currentColor" />
              暂停播放
            </button>
            <span v-if="heroSong" class="text-sm text-ink-secondary/40">
              {{ heroSong.name }} — {{ heroSong.artist }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== 为你推荐 — 网格 + 横向大卡片 ==================== -->
    <section
      data-reveal
      :data-reveal-index="1"
      :class="{ 'animate-slide-in-up': isRevealed(1) }"
    >
      <!-- 区块标题 -->
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-xl font-bold text-white flex items-center gap-2.5 text-left">
          <Disc3 class="w-5 h-5 text-primary-400" />
          为你推荐
        </h2>
        <span class="text-xs text-ink-muted">共 {{ recommendedSongs.length }} 首</span>
      </div>

      <!-- 错落网格：4列，部分卡片横跨2列 -->
      <div
        v-if="recommendedSongs.length > 0"
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        <template v-for="(song, index) in recommendedSongs" :key="song.id">
          <!-- 横向大卡片 — 跨2列 -->
          <div
            v-if="isLargeCard(index)"
            :class="gridAnimClass(index)"
            class="col-span-2"
          >
            <MusicCard :song="song" :horizontal="true" :index="index" />
          </div>
          <!-- 普通卡片 -->
          <div
            v-else
            :class="gridAnimClass(index)"
          >
            <MusicCard :song="song" :horizontal="false" :index="index" />
          </div>
        </template>
      </div>

      <!-- 空状态 -->
      <div
        v-else
        class="text-center py-16 text-ink-muted/15"
      >
        <Disc3 class="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p class="text-sm text-ink-secondary">暂无推荐歌曲</p>
      </div>
    </section>

    <!-- ==================== 热门歌曲 — 表格列表 ==================== -->
    <section
      data-reveal
      :data-reveal-index="2"
      :class="{ 'animate-slide-in-up': isRevealed(2) }"
    >
      <!-- 区块标题 -->
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-xl font-bold text-white flex items-center gap-2.5 text-left">
          <Flame class="w-5 h-5 text-primary-400" />
          热门歌曲
        </h2>
        <span class="text-xs text-ink-muted">{{ hotSongs.length }} 首歌</span>
      </div>

      <!-- 表格 -->
      <div
        v-if="hotSongs.length > 0"
        class="overflow-hidden rounded-xl border border-white/5"
      >
        <!-- 表头 -->
        <div class="flex items-center px-4 sm:px-6 py-3 text-xs font-medium text-ink-muted bg-white/[0.015] border-b border-white/5">
          <span class="w-10 text-center shrink-0">#</span>
          <span class="flex-1 min-w-0 pl-2">歌曲</span>
          <span class="w-36 hidden sm:block shrink-0">歌手</span>
          <span class="w-44 hidden md:block shrink-0">专辑</span>
          <span class="w-20 text-right shrink-0">
            <Clock class="w-3.5 h-3.5 inline-block" />
          </span>
        </div>

        <!-- 表体 -->
        <div>
          <div
            v-for="(song, index) in hotSongs"
            :key="song.id"
            class="flex items-center px-4 sm:px-6 py-2.5 transition-all duration-150 cursor-pointer"
            :class="[
              index % 2 === 0 ? 'bg-white/[0.01]' : '',
              isCurrentSong(song.id)
                ? 'bg-primary-500/8'
                : 'hover:bg-white/[0.03]',
              `animate-fade-in delay-${Math.min(index * 30, 300)}`
            ]"
            @click="handlePlaySong(song)"
          >
            <!-- 序号 -->
            <span class="w-10 text-center shrink-0">
              <span
                v-if="isPlayingSong(song.id)"
                class="inline-flex items-center justify-center"
              >
                <span class="flex items-end gap-px h-3">
                  <span class="w-0.5 bg-primary-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite]" style="height:60%"></span>
                  <span class="w-0.5 bg-primary-400 rounded-full animate-[pulse_0.4s_ease-in-out_0.15s_infinite]" style="height:100%"></span>
                  <span class="w-0.5 bg-primary-400 rounded-full animate-[pulse_0.4s_ease-in-out_0.3s_infinite]" style="height:40%"></span>
                </span>
              </span>
              <span
                v-else
                class="text-sm"
                :class="isCurrentSong(song.id) ? 'text-primary-400 font-medium' : 'text-ink-muted'"
              >
                {{ index + 1 }}
              </span>
            </span>

            <!-- 歌曲信息 -->
            <div class="flex-1 min-w-0 flex items-center gap-3 pl-2">
              <div class="cover-mask w-10 h-10 rounded-lg overflow-hidden shrink-0 shadow-md">
                <img
                  :src="song.cover"
                  :alt="song.name"
                  class="w-full h-full object-cover transition-transform duration-300"
                />
              </div>
              <div class="min-w-0 text-left">
                <p
                  class="text-base font-medium truncate transition-colors duration-200"
                  :class="isCurrentSong(song.id) ? 'text-primary-300' : 'text-white/90'"
                >
                  {{ song.name }}
                </p>
                <p class="text-sm text-ink-secondary truncate sm:hidden">{{ song.artist }}</p>
              </div>
            </div>

            <!-- 歌手 -->
            <span class="w-36 hidden sm:block shrink-0 text-sm text-ink-secondary truncate">
              {{ song.artist }}
            </span>

            <!-- 专辑 -->
            <span class="w-44 hidden md:block shrink-0 text-sm text-ink-muted truncate">
              {{ song.album }}
            </span>

            <!-- 时长 -->
            <span class="w-20 text-right shrink-0 text-sm text-ink-muted">
              {{ formatTime(song.duration) }}
            </span>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div
        v-else
        class="text-center py-16 text-ink-muted/15"
      >
        <Flame class="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p class="text-sm text-ink-secondary">暂无热门歌曲</p>
      </div>
    </section>
  </div>
</template>

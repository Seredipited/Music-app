<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getComments, submitComment } from '@/stores/data'
import { ThumbsUp, MessageCircle, Send, Loader2, Flame, Clock } from 'lucide-vue-next'
import type { Comment } from '@/stores/types'

const props = defineProps<{
  songId: number
}>()

const activeTab = ref<'hot' | 'new'>('hot')
const comments = ref<Comment[]>([])
const isLoading = ref(false)
const isSubmitting = ref(false)
const commentContent = ref('')
const currentPage = ref(1)
const totalComments = ref(0)
const likedComments = ref<number[]>([])

onMounted(() => {
  loadComments()
})

watch(() => props.songId, () => {
  currentPage.value = 1
  loadComments()
})

watch(() => activeTab.value, () => {
  currentPage.value = 1
  loadComments()
})

async function loadComments() {
  isLoading.value = true
  try {
    const result = await getComments(props.songId, currentPage.value, activeTab.value)
    if (currentPage.value === 1) {
      comments.value = result.comments
    } else {
      comments.value = [...comments.value, ...result.comments]
    }
    totalComments.value = result.total
  } finally {
    isLoading.value = false
  }
}

async function handleSubmitComment() {
  if (!commentContent.value.trim()) return
  
  isSubmitting.value = true
  try {
    const newComment = await submitComment(props.songId, commentContent.value)
    comments.value.unshift(newComment)
    commentContent.value = ''
    totalComments.value++
  } finally {
    isSubmitting.value = false
  }
}

function toggleLike(commentId: number) {
  const index = likedComments.value.indexOf(commentId)
  const comment = comments.value.find(c => c.id === commentId)
  if (comment) {
    if (index > -1) {
      likedComments.value.splice(index, 1)
      comment.liked--
      comment.isLiked = false
    } else {
      likedComments.value.push(commentId)
      comment.liked++
      comment.isLiked = true
    }
  }
}

function loadMore() {
  currentPage.value++
  loadComments()
}
</script>

<template>
  <div>
    <h2 class="text-xl font-bold mb-6 flex items-center gap-2 text-white">
      <MessageCircle class="w-5 h-5" />
      评论
      <span class="text-sm font-normal text-ink-muted">({{ totalComments }})</span>
    </h2>

    <!-- 评论输入 -->
    <div class="mb-6">
      <div class="flex gap-3">
        <div class="w-10 h-10 rounded-full gradient-primary flex-shrink-0 flex items-center justify-center">
          <span class="text-white text-sm font-medium">我</span>
        </div>
        <div class="flex-1">
          <textarea
            v-model="commentContent"
            placeholder="发表你的评论..."
            rows="3"
            class="w-full px-4 py-3 bg-white/[0.03] border border-white/5 rounded-xl resize-none text-white focus:outline-none focus:border-primary-400/30 transition-colors placeholder:text-ink-muted/40"
          ></textarea>
          <div class="flex justify-end mt-2">
            <button
              @click="handleSubmitComment"
              :disabled="!commentContent.trim() || isSubmitting"
              class="px-4 py-2 gradient-primary rounded-full text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
              <Send v-else class="w-4 h-4" />
              发布
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 标签页切换 -->
    <div class="flex gap-6 mb-6 border-b border-white/5">
      <button
        @click="activeTab = 'hot'"
        class="pb-3 text-sm font-medium transition-colors relative flex items-center gap-2"
        :class="activeTab === 'hot' ? 'text-primary-300' : 'text-ink-muted hover:text-ink-secondary'"
      >
        <Flame class="w-4 h-4" />
        热门评论
        <div
          v-if="activeTab === 'hot'"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400"
        ></div>
      </button>
      <button
        @click="activeTab = 'new'"
        class="pb-3 text-sm font-medium transition-colors relative flex items-center gap-2"
        :class="activeTab === 'new' ? 'text-primary-300' : 'text-ink-muted hover:text-ink-secondary'"
      >
        <Clock class="w-4 h-4" />
        最新评论
        <div
          v-if="activeTab === 'new'"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400"
        ></div>
      </button>
    </div>

    <!-- 加载中 -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <Loader2 class="w-8 h-8 text-primary-400 animate-spin" />
    </div>

    <!-- 评论列表 -->
    <div v-else class="space-y-5">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="flex gap-3 animate-fade-in"
      >
        <img
          :src="comment.userAvatar"
          :alt="comment.userName"
          class="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="font-medium text-sm text-white">{{ comment.userName }}</span>
            <span class="text-xs text-ink-muted">{{ comment.time }}</span>
          </div>
          <p class="text-sm text-ink-secondary leading-relaxed mb-2">
            {{ comment.content }}
          </p>
          <div class="flex items-center gap-4">
            <button
              @click="toggleLike(comment.id)"
              class="flex items-center gap-1 text-xs transition-colors"
              :class="comment.isLiked ? 'text-primary-300' : 'text-ink-muted hover:text-primary-300'"
            >
              <ThumbsUp class="w-4 h-4" :fill="comment.isLiked ? 'currentColor' : 'none'" />
              <span>{{ comment.liked }}</span>
            </button>
            <button class="flex items-center gap-1 text-xs text-ink-muted hover:text-primary-300 transition-colors">
              <MessageCircle class="w-4 h-4" />
              回复
            </button>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div v-if="comments.length < totalComments" class="flex justify-center pt-4">
        <button
          @click="loadMore"
          class="px-6 py-2 bg-white/[0.04] hover:bg-white/[0.08] rounded-full text-sm transition-colors text-ink-secondary"
        >
          加载更多
        </button>
      </div>

      <!-- 空状态 -->
      <div v-if="comments.length === 0" class="text-center py-8 text-ink-muted/30">
        <MessageCircle class="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>暂无评论，快来抢沙发吧</p>
      </div>
    </div>
  </div>
</template>

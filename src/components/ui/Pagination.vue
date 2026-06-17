<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  currentPage: number
  totalPages: number
  totalItems?: number
  pageSize?: number
}>(), {
  totalItems: 0,
  pageSize: 10
})

const emit = defineEmits<{
  'update:currentPage': [page: number]
  'pageChange': [page: number]
}>()

const displayPages = computed(() => {
  const pages: (number | string)[] = []
  const total = props.totalPages
  const current = props.currentPage
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    
    for (let i = start; i <= end; i++) pages.push(i)
    
    if (current < total - 2) pages.push('...')
    pages.push(total)
  }
  
  return pages
})

function goToPage(page: number) {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return
  emit('update:currentPage', page)
  emit('pageChange', page)
}

function handleInputChange(e: Event) {
  const target = e.target as HTMLInputElement
  const page = parseInt(target.value)
  if (!isNaN(page) && page >= 1 && page <= props.totalPages) {
    goToPage(page)
  }
}
</script>

<template>
  <div class="flex items-center justify-center gap-2 py-6">
    <!-- Prev Button -->
    <button
      @click="goToPage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="p-2 rounded-lg bg-earth-700/50 hover:bg-earth-600/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-earth-200"
    >
      <ChevronLeft class="w-5 h-5" />
    </button>
    
    <!-- Page Numbers -->
    <div class="flex items-center gap-1">
      <template v-for="(page, index) in displayPages" :key="index">
        <span v-if="page === '...'" class="px-2 text-earth-500">...</span>
        <button
          v-else
          @click="goToPage(page as number)"
          class="w-10 h-10 rounded-lg text-sm font-medium transition-all"
          :class="currentPage === page 
            ? 'gradient-primary text-white shadow-lg' 
            : 'bg-earth-700/50 hover:bg-earth-600/50 text-earth-200'"
        >
          {{ page }}
        </button>
      </template>
    </div>
    
    <!-- Page Input -->
    <div class="flex items-center gap-2 ml-2">
      <span class="text-sm text-earth-400">跳至</span>
      <input
        type="number"
        :value="currentPage"
        @change="handleInputChange"
        min="1"
        :max="totalPages"
        class="w-14 h-10 px-2 text-center bg-earth-700/50 border border-earth-600/50 rounded-lg text-earth-100 focus:outline-none focus:border-primary/50 transition-colors"
      />
      <span class="text-sm text-earth-400">页</span>
    </div>
    
    <!-- Next Button -->
    <button
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="p-2 rounded-lg bg-earth-700/50 hover:bg-earth-600/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-earth-200"
    >
      <ChevronRight class="w-5 h-5" />
    </button>
    
    <!-- Total Info -->
    <div v-if="totalItems > 0" class="ml-4 text-sm text-earth-500">
      共 {{ totalItems }} 条
    </div>
  </div>
</template>

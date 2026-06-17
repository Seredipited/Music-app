<script setup lang="ts">
import { watch } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps<{
  open: boolean
  title?: string
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  close: []
}>()

function handleClose() {
  emit('update:open', false)
  emit('close')
}

function handleBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    handleClose()
  }
}

watch(() => props.open, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        @click="handleBackdropClick"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40"></div>
        
        <!-- Dialog Content -->
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 scale-95 translate-y-2"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-2"
        >
          <div
            v-if="open"
            class="relative w-full max-w-lg bg-white rounded-lg shadow-xl border border-gray-200 max-h-[90vh] overflow-hidden"
          >
            <!-- Header -->
            <div v-if="title" class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 class="text-base font-semibold text-[#303133]">{{ title }}</h2>
              <button
                @click="handleClose"
                class="p-1.5 rounded hover:bg-gray-100 transition-colors text-[#909399] hover:text-[#606266]"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
            
            <!-- Close button without title -->
            <button
              v-if="!title"
              @click="handleClose"
              class="absolute top-4 right-4 p-1.5 rounded hover:bg-gray-100 transition-colors text-[#909399] z-10"
            >
              <X class="w-4 h-4" />
            </button>
            
            <!-- Body -->
            <div class="px-6 py-5 overflow-y-auto" :style="{ maxHeight: title ? 'calc(90vh - 120px)' : 'calc(90vh - 60px)' }">
              <slot></slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

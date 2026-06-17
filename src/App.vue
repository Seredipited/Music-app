<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import Sidebar from '@/components/layout/Sidebar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { User } from 'lucide-vue-next'

const activeMenu = ref('songs')
</script>

<template>
  <div class="flex min-h-screen bg-[#f5f5f5]">
    <!-- Sidebar -->
    <Sidebar v-model:activeMenu="activeMenu" />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-h-screen overflow-auto">
      <!-- Top Bar -->
      <header class="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-end shrink-0">
        <button class="flex items-center gap-1.5 text-sm text-[#606266] hover:text-[#409eff] transition-colors cursor-pointer">
          <User class="w-4 h-4" />
          管理员
        </button>
      </header>

      <!-- Page Content -->
      <main class="flex-1">
        <RouterView />
      </main>

      <!-- Player Bar (fixed at bottom) -->
      <AppFooter />
    </div>
  </div>
</template>

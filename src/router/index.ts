import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import FrontHome from '@/views/FrontHome.vue'
import Search from '@/views/Search.vue'
import Player from '@/views/Player.vue'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Genres from '@/views/admin/Genres.vue'
import Tags from '@/views/admin/Tags.vue'
import Artists from '@/views/admin/Artists.vue'
import Albums from '@/views/admin/Albums.vue'
import Statistics from '@/views/admin/Statistics.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'frontHome',
      component: FrontHome
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
    {
      path: '/player/:id',
      name: 'player',
      component: Player
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/admin',
      redirect: '/admin/songs'
    },
    {
      path: '/admin/songs',
      name: 'adminSongs',
      component: Home
    },
    {
      path: '/admin/genres',
      name: 'adminGenres',
      component: Genres
    },
    {
      path: '/admin/tags',
      name: 'adminTags',
      component: Tags
    },
    {
      path: '/admin/artists',
      name: 'adminArtists',
      component: Artists
    },
    {
      path: '/admin/albums',
      name: 'adminAlbums',
      component: Albums
    },
    {
      path: '/admin/stats',
      name: 'adminStats',
      component: Statistics
    }
  ]
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  if (to.path.startsWith('/admin') && !authStore.isAdmin) {
    return {
      path: '/login',
      query: { redirect: to.fullPath }
    }
  }
})

export default router

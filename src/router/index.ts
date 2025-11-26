import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/home/index.vue'
import MenuPage from '@/views/menu/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/menu', name: 'menu', component: MenuPage },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return { ...savedPosition, behavior: 'smooth' }
    return { left: 0, top: 0, behavior: 'smooth' }
  },
})

export default router

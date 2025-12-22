import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/home/index.vue'
import MenuPage from '@/views/menu/index.vue'
import EventsPage from '@/views/events/index.vue'
import EventDetail from '@/views/events/EventDetail.vue'
import ReservationsPage from '@/views/reservations/index.vue'
import NotFoundPage from '@/views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/menu', name: 'menu', component: MenuPage },
    { path: '/events', name: 'events', component: EventsPage },
    { path: '/events/:slug', name: 'event-detail', component: EventDetail },
    { path: '/reservations', name: 'reservations', component: ReservationsPage },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return { ...savedPosition, behavior: 'smooth' }
    return { left: 0, top: 0, behavior: 'smooth' }
  },
})

export default router

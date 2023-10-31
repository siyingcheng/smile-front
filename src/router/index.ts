import { createRouter, createWebHistory } from 'vue-router'
import AppLayoutVue from '@/components/layout/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AppLayoutVue,
    },
  ],
})

export default router

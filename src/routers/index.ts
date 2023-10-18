import { useUserStore } from '@/stores/UserStore'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import UserManagement from '@/views/UserManagement.vue'
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requireAuth: false,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requireAuth: false,
    },
  },
  {
    path: '/users',
    name: 'User Management',
    component: UserManagement,
    meta: {
      requireAuth: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  // ✅ This will work because the router starts its navigation after
  // the router is installed and pinia will be installed too
  const store = useUserStore()

  if (to.meta.requiresAuth && !store.isLogin) return '/login'
})

export default router

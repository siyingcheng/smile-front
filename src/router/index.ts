import { useUserStore } from '@/stores/UserStore'
import { Roles } from '@/types'
import IndexViewVue from '@/views/IndexView.vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const NotFoundPage = () => import('@/components/NotFoundPage.vue')
const LoginView = () => import('@/views/login/LoginView.vue')
const UserManageView = () => import('@/views/management/UserManageView.vue')
const RegisterView = () => import('@/views/login/RegisterView.vue')
const AddressManageView = () => import('@/views/users/AddressManageView.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: IndexViewVue,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
  },
  {
    path: '/user',
    name: 'UserSettings',
    meta: {
      requireAuth: true,
    },
    children: [
      {
        path: '/user/address',
        name: 'AddressManage',
        component: AddressManageView,
      },
    ],
  },
  {
    path: '/management',
    name: 'Management',
    meta: {
      requireAuth: true,
      requireAdmin: true,
    },
    children: [
      {
        path: '/management/users',
        name: 'UserManage',
        component: UserManageView,
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

router.beforeEach((to, from) => {
  // ✅ This will work because the router starts its navigation after
  // the router is installed and pinia will be installed too
  const store = useUserStore()

  // Resource required log in
  if (to.meta.requireAuth && !store.isLogin) {
    return {
      path: '/login',
      // save the location we were at to come back later
      query: { redirect: to.fullPath },
    }
  }

  // Resource required ADMIN role
  if (
    to.meta.requireAdmin &&
    !store.loginUser?.roles?.includes(Roles.ROLE_ADMIN)
  ) {
    ElNotification({
      type: 'warning',
      message: 'You have not access right here!',
    })
    return from
  }
})

export default router

<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
  >
    <el-menu-item index="0">
      <router-link to="/">
        <img src="@/assets/vue.svg" alt="Logo" />
      </router-link>
    </el-menu-item>
    <el-menu-item index="1">
      <router-link to="/">Home</router-link>
    </el-menu-item>
    <el-menu-item index="2" v-show="userStore.isLogin && isAdmin()">
      <router-link to="/users">User Management</router-link>
    </el-menu-item>
    <div class="flex-grow" />
    <el-menu-item index="3" v-if="userStore.isLogin">
      <router-link to="/" @click="logout">Logout</router-link>
    </el-menu-item>
    <el-menu-item index="3" v-else>
      <router-link to="/login">Login</router-link>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/UserStore'
import { Roles } from '@/types'
import { ElNotification } from 'element-plus'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const activeIndex = ref('1')

const router = useRouter()

watch(
  () => router.currentRoute.value.path,
  (newPath) => {
    if (newPath === '/login' || newPath === '/logout') {
      activeIndex.value = '3'
    } else if (newPath.startsWith('/users')) {
      activeIndex.value = '2'
    } else {
      activeIndex.value = '1'
    }
  }
)

const isAdmin = (): boolean => {
  return userStore.loginUser?.roles?.includes(Roles.ROLE_ADMIN) || false
}

const logout = (): void => {
  userStore.$reset()
  router.push({ name: 'Home' })
  activeIndex.value = '1'
  ElNotification({
    type: 'success',
    message: 'See you again',
  })
}
</script>

<style>
.flex-grow {
  flex-grow: 1;
}

.el-menu {
  align-items: center;
  justify-content: center;
}

.el-menu-item a {
  text-decoration: none;
}
</style>

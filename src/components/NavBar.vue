<script async setup lang="ts">
import { useUserStore } from '@/stores/UserStore'
import { Roles } from '@/types'

const userStore = useUserStore()
const router = useRouter()

// load user from local
userStore.getCurrentUser()

const doLogout = () => {
  ElNotification({
    type: 'success',
    message: 'See you again!',
  })
  userStore.$reset()
  localStorage.removeItem('item')
  router.push('/')
}

const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
  activeIndex.value = key
}

watch(
  () => router.currentRoute.value.path,
  (newPath) => {
    // console.log(newPath)
    activeIndex.value = newPath
  },
)
</script>

<template>
  <el-header>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      :ellipsis="false"
      @select="handleSelect"
      :router="true"
    >
      <el-menu-item index="">
        <img style="width: 45px" src="@/assets/logo.svg" alt="Logo" />
      </el-menu-item>
      <el-menu-item index="/">
        <el-icon><IEpHomeFilled /></el-icon>
        Home
      </el-menu-item>
      <el-sub-menu
        index="/management"
        v-show="userStore.loginUser?.roles.includes(Roles.ROLE_ADMIN)"
      >
        <template #title>
          <el-icon><IEpManagement /></el-icon>
          Management
        </template>
        <el-menu-item index="/management/users">
          <el-icon><IEpUser /></el-icon>
          User Management
        </el-menu-item>
      </el-sub-menu>
      <div class="flex-grow" />
      <el-menu-item>
        <template v-if="userStore.isLogin">
          <el-sub-menu index="/user">
            <template #title>{{
              userStore.loginUser?.nickname || userStore.loginUser?.username
            }}</template>
            <el-menu-item index="/user/logout" @click="doLogout">
              <el-icon><IEpSwitchButton /></el-icon>
              Logout
            </el-menu-item>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item index="/login">Login</el-menu-item>
        </template>
      </el-menu-item>
    </el-menu>
  </el-header>
</template>

<style lang="scss" scoped>
.flex-grow {
  flex-grow: 1;
}
</style>

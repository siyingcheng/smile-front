<template>
  <div>
    <h1>Login</h1>
    <el-form :model="loginForm" label-width="120px">
      <el-form-item label="Username">
        <el-input
          v-model="loginForm.username"
          placeholder="username or email"
        />
      </el-form-item>
      <el-form-item label="Password">
        <el-input v-model="loginForm.password" placeholder="password" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onLogin">Login</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import loginService from '@/services/LoginService'
import { useUserStore } from '@/stores/UserStore'
import { SmileResponseType, SmileUserType } from '@/types/index'
import { ElNotification } from 'element-plus'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

// do not use same name with ref
const loginForm = reactive({
  username: '',
  password: '',
})

const router = useRouter()

const userStore = useUserStore()

const onLogin = async () => {
  await loginService
    .login(loginForm.username, loginForm.password)
    .then((response: SmileResponseType) => {
      let data = response.data as any
      let token = data.token
      let user = data.userInfo as SmileUserType
      // save to local
      localStorage.setItem('token', token)
      // save to store
      userStore.isLogin = true
      userStore.loginUser = user
      // notification
      ElNotification({
        title: 'Welecom',
        type: 'success',
        message: `Hi, ${user.nickname || user.username} have a nice day!`,
      })
      // auto navigate to Home
      router.push({ name: 'Home' })
    })
    .catch((error) => {
      ElNotification({
        title: 'Error',
        type: 'error',
        message: error.response?.data?.message || 'Login Error',
      })
    })
}
</script>

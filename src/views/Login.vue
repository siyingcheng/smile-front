<template>
  <div style="height: 100%">
    <el-row class="row-bg" justify="center" align="middle" style="height: 100%">
      <el-col :xs="20" :sm="12" :md="8" :lg="6">
        <div class="grid-content">
          <div class="login-header">
            <h1 class="">Login</h1>
          </div>
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
      </el-col>
    </el-row>
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
      userStore.token = token
      // notification
      ElNotification({
        title: 'Welecom',
        type: 'success',
        message: `Hi, ${user.nickname || user.username} have a nice day!`,
      })
      // auto navigate to Home
      router.push({ name: 'Home' })
    })
}
</script>

<style scoped>
.login-header {
  text-align: center;
}
</style>

<script setup lang="ts">
import loginService from '@/services/LoginService.js'
import { useUserStore } from '@/stores/UserStore.js'
import type { LoginDataType, SmileResponseType } from '@/types'
import { type FormInstance, type FormRules } from 'element-plus'

const router = useRouter()
const route = useRoute()

const loginForm = reactive<{
  username: string
  password: string
}>({
  username: '',
  password: '',
})

const loginRules = reactive<FormRules>({
  username: [
    {
      required: true,
      message: 'Username or email is required.',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: 'Password is required.',
      trigger: 'blur',
    },
  ],
})

const loginFormRef = ref<FormInstance>()

const isLoginDisabled = computed(() => {
  return loginForm.username.length === 0 || loginForm.password.length === 0
})

const isLogging = ref(false)

const userStore = useUserStore()

const redirectBack = () => router.push((route.query.redirect as string) || '/')

if (userStore.isLogin) {
  redirectBack()
}

const doLogin = async () => {
  await loginFormRef.value?.validate().then(() => {
    isLogging.value = true
    loginService
      .login(loginForm.username, loginForm.password)
      .then((data: SmileResponseType<LoginDataType>) => {
        let loginData = data.data as LoginDataType

        // Save current login information
        localStorage.setItem('token', loginData.token)
        userStore.isLogin = true
        userStore.loginUser = loginData.userInfo
        userStore.token = loginData.token

        // Notification
        let name = loginData.userInfo.nickname || loginData.userInfo.username
        ElNotification({
          type: 'success',
          message: `Welcome ${name}`,
        })

        // Navigator to home
        redirectBack()
      })
      .catch((error) => {
        ElMessage({
          type: 'error',
          message: `Login failed: ${
            error.response.data?.message || 'please check username and password'
          }`,
        })
      })
      .finally(() => {
        isLogging.value = false
      })
  })
}
</script>

<template>
  <div class="login">
    <el-card>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="120px"
        label-position="top"
      >
        <h2>Login</h2>
        <el-form-item label="Username or email address" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="Username or Email"
          />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            placeholder="Password"
          />
        </el-form-item>

        <div class="login-btn-group">
          <el-button
            class="btn-login"
            type="primary"
            @click="doLogin"
            :disabled="isLoginDisabled"
            :loading="isLogging"
          >
            Login
          </el-button>
        </div>

        <div class="register">
          <p>New to here? <a href="/register">Create an account</a></p>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.login {
  background-color: #ccc;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .el-form {
    width: 274px;
    background-color: #fff;
    padding: 2em;
    border-radius: 1em;

    .el-form-item {
      margin-top: 1.5em;
    }
  }
}

.login-btn-group {
  margin-top: 2em;
  display: flex;
  justify-content: space-around;

  .el-button {
    width: 100%;
  }
}

.register {
  margin-top: 1em;
  text-align: center;

  a {
    text-decoration: none;
    margin-left: 0.5em;
    cursor: pointer;
  }
}
</style>

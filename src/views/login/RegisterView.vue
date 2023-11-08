<script setup lang="ts">
import { useUserStore } from '@/stores/UserStore'
import type { NewSmileUserType } from '@/types'
import { type FormInstance, type FormRules } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

if (userStore.isLogin) {
  router.push('/')
}

const registerForm = reactive<NewSmileUserType>({} as NewSmileUserType)
const registerFormRef = ref<FormInstance>()
const isRegisterDisabled = computed(() => {
  return !(
    registerForm.username &&
    registerForm.email &&
    registerForm.password &&
    registerForm.confirmPassword
  )
})
const isLogging = ref(false)
const doRegister = async () => {
  isLogging.value = true
  userStore
    .createUser(registerForm, true)
    .then(() => {
      ElNotification({
        type: 'success',
        message: 'Successfully create account',
      })
      registerForm.username = ''
      registerForm.nickname = ''
      registerForm.email = ''
      registerForm.password = ''
      registerForm.confirmPassword = ''
      router.push('/login')
    })
    .catch((error) => {
      ElMessage({
        type: 'error',
        message:
          error.response?.data?.message ||
          'Register error, please check your input',
      })
    })
    .finally(() => (isLogging.value = false))
}
const usernameRules = [
  { required: true, message: 'Username is required', trigger: 'blur' },
  { min: 3, max: 16, message: 'Length should be 3 to 16', trigger: 'blur' },
]
const nicknameRules = [
  { max: 32, message: 'Length should be 0 to 32', trigger: 'blur' },
]
const validateEmail = (rule: any, value: any, callback: any) => {
  if (!registerForm.email.includes('@')) {
    callback(new Error('Please input the incorrect email'))
  } else if (registerForm.email.length <= 3 || registerForm.email.length > 32) {
    callback(new Error('Length should be 4 to 32'))
  }
  callback()
}
const REGEX_PASSWORD = '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\\S+$).{8,20}$'
const validatePassword = (rule: any, value: any, callback: any) => {
  if (!registerForm.password.match(REGEX_PASSWORD)) {
    callback(
      new Error(
        'Password should contains: at least a lower character, at least a upper character, at least a number and no space',
      ),
    )
  }
  callback()
}
const validateConfirmPassWord = (rule: any, value: any, callback: any) => {
  if (registerForm.password !== registerForm.confirmPassword) {
    callback(new Error('The two passwords should be the same'))
  }
  callback()
}
const emailRules = [
  { required: true, message: 'Email is required', trigger: 'blur' },
  {
    validator: validateEmail,
    message: 'Please input a valid email',
    trigger: 'blur',
  },
]
const registerRules = reactive<FormRules<typeof registerForm>>({
  username: usernameRules,
  nickname: nicknameRules,
  email: emailRules,
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
    { min: 8, max: 20, message: 'Length should be 8 to 20', trigger: 'blur' },
    {
      validator: validatePassword,
      message:
        'Password should contains: at least a lower character, at least a upper character, at least a number and no space',
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    {
      validator: validateConfirmPassWord,
      message: 'The two passwords should be the same',
      trigger: 'blur',
    },
  ],
})
</script>

<template>
  <div class="register">
    <el-card>
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-width="90px"
        label-position="left"
      >
        <h2 class="register-title">CREATE ACCOUNT</h2>
        <el-form-item label="Username" prop="username">
          <el-input v-model="registerForm.username" placeholder="Username" />
        </el-form-item>
        <el-form-item label="Nickname" prop="nickname">
          <el-input v-model="registerForm.nickname" placeholder="Nickname" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input
            v-model="registerForm.email"
            placeholder="smile@example.com"
          />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="registerForm.password" type="password" />
        </el-form-item>
        <el-form-item label="Re Password" prop="confirmPassword">
          <el-input v-model="registerForm.confirmPassword" type="password" />
        </el-form-item>

        <div class="login-btn-group">
          <el-button
            class="btn-login"
            type="primary"
            @click="doRegister"
            :disabled="isRegisterDisabled"
            :loading="isLogging"
          >
            Register
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.register {
  background-color: #ccc;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .el-form {
    width: 300px;
    background-color: #fff;
    padding: 2em;
    border-radius: 1em;

    .el-form-item {
      margin-top: 2.5em;
      padding-top: 0.5em;
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

.register-title {
  text-align: center;
}
</style>

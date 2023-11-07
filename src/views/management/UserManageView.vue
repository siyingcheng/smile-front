<script setup lang="ts">
import { useUserStore } from '@/stores/UserStore'
import { Roles, type NewSmileUserType } from '@/types'
import { type FormInstance, type FormRules } from 'element-plus'

const userStore = useUserStore()

userStore.getUserList()

const handleClick = () => {
  console.log('click')
}

const showDeleteModal = () => {
  console.log('open delete confirm modal')
}

// add user modal
const newUserFormRef = ref<FormInstance>()
const addUserModalVisible = ref(false)
const newUserForm = reactive<NewSmileUserType>({} as NewSmileUserType)
const validateEmail = (rule: any, value: any, callback: any) => {
  if (!newUserForm.email.includes('@')) {
    callback(new Error('Please input the incorrect email'))
  } else if (newUserForm.email.length <= 3 || newUserForm.email.length > 32) {
    callback(new Error('Length should be 4 to 32'))
  }
  callback()
}
const REGEX_PASSWORD = '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\\S+$).{8,20}$'
const validatePassword = (rule: any, value: any, callback: any) => {
  if (!newUserForm.password.match(REGEX_PASSWORD)) {
    callback(
      new Error(
        'Password should contains: at least a lower character, at least a upper character, at least a number and no space',
      ),
    )
  }
  callback()
}
const validateConfirmPassWord = (rule: any, value: any, callback: any) => {
  if (newUserForm.password !== newUserForm.confirmPassword) {
    callback(new Error('The two passwords should be the same'))
  }
  callback()
}
const newUserRules = reactive<FormRules<typeof newUserForm>>({
  username: [
    { required: true, message: 'Username is required', trigger: 'blur' },
    { min: 3, max: 16, message: 'Length should be 3 to 16', trigger: 'blur' },
  ],
  nickname: [{ max: 32, message: 'Length should be 0 to 32', trigger: 'blur' }],
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    {
      validator: validateEmail,
      message: 'Please input a valid email',
      trigger: 'blur',
    },
  ],
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
    },
  ],
})

const doCreateUser = async () => {
  await newUserFormRef.value?.validate().then(async () => {
    await userStore
      .createUser(newUserForm)
      .then(() => {
        ElMessage({
          type: 'success',
          message: 'Successfully created a new user.',
        })
        newUserForm.username = ''
        newUserForm.nickname = ''
        newUserForm.email = ''
        newUserForm.password = ''
        newUserForm.confirmPassword = ''
        newUserForm.roles = ''
        addUserModalVisible.value = false
      })
      .catch((error) => {
        ElMessage({
          type: 'error',
          message: 'The creation of a new user failed.',
        })
      })
  })
}
</script>

<template>
  <el-row>
    <el-col :lg="16">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <el-button
              class="button"
              type="primary"
              @click="addUserModalVisible = true"
              >Add User</el-button
            >
          </div>
        </template>

        <el-table :data="userStore.userList" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="username" label="Username" width="150" />
          <el-table-column prop="nickname" label="Nickname" width="150" />
          <el-table-column prop="email" label="Email" width="180" />
          <el-table-column prop="roles" label="Roles" width="150" />
          <el-table-column
            prop="enabled"
            label="Enabled"
            width="150"
            align="center"
          >
            <template #default="scop">
              <el-icon v-if="scop.row.enabled" color="green"
                ><IEpSelect
              /></el-icon>
              <el-icon v-else color="red"><IEpCloseBold /></el-icon>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="Operations" width="120">
            <template #default>
              <el-button link type="primary" size="small" @click="handleClick">
                Edit
              </el-button>
              <el-button
                link
                type="danger"
                size="small"
                @click="showDeleteModal"
                >Delete</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <el-dialog v-model="addUserModalVisible" center width="480">
          <template #header>
            <h2>Create User</h2>
          </template>
          <el-form
            :model="newUserForm"
            label-width="120px"
            label-position="right"
            :rules="newUserRules"
            ref="newUserFormRef"
          >
            <el-form-item label="Username" prop="username">
              <el-input v-model="newUserForm.username" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Nickname" prop="nickname">
              <el-input v-model="newUserForm.nickname" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Email" prop="email">
              <el-input v-model="newUserForm.email" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Password" prop="password">
              <el-input
                v-model="newUserForm.password"
                autocomplete="off"
                type="password"
              />
            </el-form-item>
            <el-form-item label="Confirm Password" prop="confirmPassword">
              <el-input
                v-model="newUserForm.confirmPassword"
                autocomplete="off"
                type="password"
              />
            </el-form-item>
            <el-form-item label="Role" prop="roles">
              <el-select
                v-model="newUserForm.roles"
                placeholder="Please select a role"
              >
                <el-option label="Admin User" :value="Roles.ROLE_ADMIN" />
                <el-option label="Normal User" :value="Roles.ROLE_USER" />
              </el-select>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="addUserModalVisible = false">Cancel</el-button>
              <el-button type="primary" @click="doCreateUser">
                Confirm
              </el-button>
            </span>
          </template>
        </el-dialog>
      </el-card>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.el-card {
  margin: 2em auto auto auto;
  width: 90%;
}

.el-col {
  margin: auto auto;
}

.el-form-item {
  margin-top: 2.2em;
}
</style>

<script setup lang="ts">
import { useUserStore } from '@/stores/UserStore'
import {
  Roles,
  type NewSmileUserType,
  type SmileUserType,
  type IdType,
} from '@/types'
import { type FormInstance, type FormRules } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'

const userStore = useUserStore()

userStore.getUserList()

// search
const search = ref('')
const filterEnabled = (enabled: string, user: SmileUserType) => {
  return user.enabled === /true/i.test(enabled)
}
const filterRole = (role: string, user: SmileUserType) => {
  return user.roles === role
}
const userList = computed(() => {
  return userStore.userList.filter(
    (data) =>
      !search.value ||
      data.username
        .toLocaleLowerCase()
        .includes(search.value.toLocaleLowerCase()) ||
      (data.nickname &&
        data.nickname
          .toLocaleLowerCase()
          .includes(search.value.toLocaleLowerCase())) ||
      data.email.toLocaleLowerCase().includes(search.value.toLocaleLowerCase()),
  )
})

const openEditModal = (data: SmileUserType) => {
  Object.assign(editUserForm, data)
  editUserModalVisible.value = true
}

const confirmDelete = async (id: IdType) => {
  await userStore
    .deleteUser(id)
    .then(() => {
      ElNotification({
        type: 'success',
        message: 'Successfully delete user',
      })
    })
    .catch((error) => {
      ElMessage.error({
        type: 'error',
        message: error.response?.data?.message || 'The deletion of user failed',
      })
    })
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
const usernameRules = [
  { required: true, message: 'Username is required', trigger: 'blur' },
  { min: 3, max: 16, message: 'Length should be 3 to 16', trigger: 'blur' },
]
const nicknameRules = [
  { max: 32, message: 'Length should be 0 to 32', trigger: 'blur' },
]
const emailRules = [
  { required: true, message: 'Email is required', trigger: 'blur' },
  {
    validator: validateEmail,
    message: 'Please input a valid email',
    trigger: 'blur',
  },
]
const newUserRules = reactive<FormRules<typeof newUserForm>>({
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
          message: `The creation of a new user failed: ${error.response.data.message}`,
        })
      })
  })
}

// edit user
const editUserFormRef = ref<FormInstance>()
const editUserModalVisible = ref(false)
const editUserForm = reactive<SmileUserType>({} as SmileUserType)
const editUserRules = reactive<FormRules<typeof editUserForm>>({
  username: usernameRules,
  nickname: nicknameRules,
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (!editUserForm.email.includes('@')) {
          callback(new Error('Please input the incorrect email'))
        } else if (
          editUserForm.email.length <= 3 ||
          editUserForm.email.length > 32
        ) {
          callback(new Error('Length should be 4 to 32'))
        }
        callback()
      },
      message: 'Please input a valid email',
      trigger: 'blur',
    },
  ],
})

const doEditUser = async () => {
  await editUserFormRef.value?.validate().then(async () => {
    await userStore
      .updateUser(editUserForm.id as number, editUserForm)
      .then(() => {
        ElMessage({
          type: 'success',
          message: 'Successfully edit a new user.',
        })
        editUserModalVisible.value = false
      })
      .catch((error) => {
        ElMessage({
          type: 'error',
          message: `The edition of a new user failed: ${error.response.data.message}`,
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

        <el-table :data="userList" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="username" label="Username" width="150" />
          <el-table-column prop="nickname" label="Nickname" width="150" />
          <el-table-column prop="email" label="Email" width="180" />
          <el-table-column
            prop="roles"
            label="Roles"
            width="150"
            :filters="[
              { text: 'ROLE_ADMIN', value: 'ROLE_ADMIN' },
              { text: 'ROLE_USER', value: 'ROLE_USER' },
            ]"
            :filter-method="filterRole"
          />
          <el-table-column
            prop="enabled"
            label="Enabled"
            width="150"
            align="center"
            :filters="[
              { text: 'Disable', value: 'false' },
              { text: 'Enable', value: 'true' },
            ]"
            :filter-method="filterEnabled"
          >
            <template #default="scop">
              <el-icon v-if="scop.row.enabled" color="green"
                ><IEpSelect
              /></el-icon>
              <el-icon v-else color="red"><IEpCloseBold /></el-icon>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="Operations"
            width="150"
            align="center"
          >
            <template #header>
              <el-input
                v-model="search"
                size="small"
                placeholder="Type to search"
                :clearable="true"
              />
            </template>
            <template #default="scop">
              <el-button
                link
                type="primary"
                size="small"
                @click="openEditModal(scop.row)"
              >
                Edit
              </el-button>
              <el-popconfirm
                width="220"
                confirm-button-text="OK"
                cancel-button-text="No, Thanks"
                :icon="InfoFilled"
                icon-color="#626AEF"
                title="Are you sure to delete this?"
                @confirm="confirmDelete(scop.row.id)"
              >
                <template #reference>
                  <el-button link type="danger" size="small">Delete</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!-- Create User Dialog -->
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

        <!-- Edit User Dialog -->
        <el-dialog v-model="editUserModalVisible" center width="480">
          <template #header>
            <h2>Edit User</h2>
          </template>
          <el-form
            :model="editUserForm"
            label-width="120px"
            label-position="right"
            :rules="editUserRules"
            ref="editUserFormRef"
          >
            <el-form-item label="Username" prop="username">
              <el-input v-model="editUserForm.username" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Nickname" prop="nickname">
              <el-input v-model="editUserForm.nickname" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Email" prop="email">
              <el-input v-model="editUserForm.email" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Role" prop="roles">
              <el-select
                v-model="editUserForm.roles"
                placeholder="Please select a role"
              >
                <el-option label="Admin User" :value="Roles.ROLE_ADMIN" />
                <el-option label="Normal User" :value="Roles.ROLE_USER" />
              </el-select>
            </el-form-item>
            <el-form-item label="Active" prop="enabled">
              <el-radio :label="true" v-model="editUserForm.enabled"
                >Enabled</el-radio
              >
              <el-radio :label="false" v-model="editUserForm.enabled"
                >Disabled</el-radio
              >
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="editUserModalVisible = false"
                >Cancel</el-button
              >
              <el-button type="primary" @click="doEditUser">
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

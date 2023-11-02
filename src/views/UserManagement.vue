<template>
  <el-table :data="userStore.userList" style="width: 100%">
    <el-table-column prop="id" label="ID" width="60" />
    <el-table-column prop="username" label="Username" />
    <el-table-column prop="nickname" label="Nickname" />
    <el-table-column prop="email" label="Email" />
    <el-table-column prop="roles" label="Roles" />
    <el-table-column fixed="right" label="Operations" width="120">
      <template #default>
        <el-button link type="primary" size="small" @click="handleClick"
          >Detail</el-button
        >
        <el-button link type="primary" size="small">Edit</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="isUpdateUser" title="Update user">
    <el-form :model="updateUser">
      <el-form-item label="Username" :label-width="formLabelWidth">
        <el-input v-model="updateUser.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Email" :label-width="formLabelWidth">
        <el-input v-model="updateUser.email" autocomplete="off" />
      </el-form-item>
      <!-- <el-form-item label="Zones" :label-width="formLabelWidth">
        <el-select v-model="form.region" placeholder="Please select a zone">
          <el-option label="Zone No.1" value="shanghai" />
          <el-option label="Zone No.2" value="beijing" />
        </el-select>
      </el-form-item> -->
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="isUpdateUser = false">Cancel</el-button>
        <el-button type="primary" @click="doUpdateUser"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/UserStore'
import { SmileUserType } from '@/types'
import { reactive, ref } from 'vue'

// retrieve users
const userStore = useUserStore()
userStore.getUsers()

const handleClick = () => {
  console.log('open update user dialog')
  isUpdateUser.value = true
}

// update user dialog
const formLabelWidth = ref('140px')
const isUpdateUser = ref(false)
const updateUser = reactive<SmileUserType>({
  username: 'simon',
  email: 'xxx@xsf.xsdf',
})

const doUpdateUser = () => {
  console.log('Do update user ...')
  isUpdateUser.value = false
}
</script>

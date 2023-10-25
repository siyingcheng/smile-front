import userService from '@/services/UserService'
import { SmileUserType } from '@/types'
import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const isLogin: Ref<boolean> = ref(false)
  const loginUser: Ref<SmileUserType | null> = ref(null)
  const userList: Ref<Array<SmileUserType>> = ref([])
  const token: Ref<string | null> = ref(localStorage.getItem('token'))

  function $reset() {
    isLogin.value = false
    loginUser.value = null
    userList.value = []
    token.value = null
    localStorage.removeItem('token')
  }

  async function loadLocalUser() {
    if (!token.value) return
    await userService
      .current_user()
      .then((data) => {
        isLogin.value = true
        loginUser.value = data.data as SmileUserType
      })
      .catch(() => {
        $reset()
      })
  }

  async function getUsers() {
    await userService
      .user_list()
      .then((data) => (userList.value = data.data as SmileUserType[]))
  }

  return {
    token,
    isLogin,
    loginUser,
    userList,
    $reset,
    loadLocalUser,
    getUsers,
  }
})

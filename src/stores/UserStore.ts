import userService from '@/services/UserService'
import type { SmileUserType } from '@/types'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const isLogin = ref(false)
  const loginUser = ref<SmileUserType | null>(null)
  const token = ref<string | null>(null)
  const userList = ref<SmileUserType[]>([])

  const getCurrentUser = async () => {
    token.value = localStorage.getItem('token')
    if (!token.value) return
    await userService
      .currentUser()
      .then((response) => {
        isLogin.value = true
        loginUser.value = response.data as SmileUserType
      })
      .catch(() => {
        localStorage.removeItem('token')
        $reset()
      })
  }

  const getUserList = async () => {
    await userService
      .userList()
      .then((response) => {
        userList.value = response.data as SmileUserType[]
      })
      .catch(() => (userList.value = []))
  }

  const createUser = async (newUser: SmileUserType, isRegister = false) => {
    return isRegister
      ? await userService.registerUser(newUser)
      : await userService.createUser(newUser).then(() => getUserList())
  }

  const deleteUser = async (id: string | number) => {
    return await userService.deleteUser(id).then(() => getUserList())
  }

  const updateUser = async (id: string | number, user: SmileUserType) => {
    return await userService.updateUser(id, user).then(() => getUserList())
  }

  const $reset = () => {
    isLogin.value = false
    loginUser.value = null
    token.value = null
  }

  return {
    isLogin,
    loginUser,
    token,
    userList,
    $reset,
    getCurrentUser,
    getUserList,
    createUser,
    deleteUser,
    updateUser,
  }
})

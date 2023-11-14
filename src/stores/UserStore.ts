import userService from '@/services/UserService'
import type { IdType, SmileUserType, UserAddressType } from '@/types'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const isLogin = ref(false)
  const loginUser = ref<SmileUserType | null>(null)
  const token = ref<string | null>(null)
  const userList = ref<SmileUserType[]>([])
  const addressList = ref<UserAddressType[]>([])

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

  const deleteUser = async (id: IdType) => {
    return await userService.deleteUser(id).then(() => getUserList())
  }

  const updateUser = async (id: IdType, user: SmileUserType) => {
    return await userService.updateUser(id, user).then(() => getUserList())
  }

  const getAddress = async (addressId: IdType) => {
    return await userService.getAddress(addressId)
  }

  const getAddressList = async (userId: IdType) => {
    return await userService
      .getAddressList(userId)
      .then((data) => (addressList.value = data.data as UserAddressType[]))
      .catch(() => (addressList.value = []))
  }

  const createAddress = async (address: UserAddressType) => {
    return await userService
      .createAddress(loginUser.value?.id as number, address)
      .then(() => getAddressList(loginUser.value?.id as number))
  }

  const deleteAddress = async (addressId: IdType) => {
    return await userService
      .deleteAddress(addressId)
      .then(() => getAddressList(loginUser.value?.id as number))
  }

  const updateAddress = async (addressId: IdType, address: UserAddressType) => {
    return await userService
      .updateAddress(loginUser.value?.id as number, addressId, address)
      .then(() => getAddressList(loginUser.value?.id as number))
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
    addressList,
    $reset,
    getCurrentUser,
    getUserList,
    createUser,
    deleteUser,
    updateUser,
    getAddress,
    getAddressList,
    createAddress,
    deleteAddress,
    updateAddress,
  }
})

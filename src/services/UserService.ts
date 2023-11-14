import apiClient from '@/services/HttpCommon'
import type {
  IdType,
  SmileResponseType,
  SmileUserType,
  UserAddressType,
} from '@/types'

const USERS_URI = '/users'
const CURRENT_USER_URI = `${USERS_URI}/current_user`

class UserService {
  currentUser(): Promise<SmileResponseType<SmileUserType>> {
    return apiClient.get(CURRENT_USER_URI)
  }

  userList(): Promise<SmileResponseType<SmileUserType[]>> {
    return apiClient.get(USERS_URI)
  }

  createUser(
    newUser: SmileUserType,
  ): Promise<SmileResponseType<SmileUserType>> {
    return apiClient.post(USERS_URI, newUser)
  }

  registerUser(
    newUser: SmileUserType,
  ): Promise<SmileResponseType<SmileUserType>> {
    // register request cannot carry header Authorization, otherwise 401
    const client = axios.create({
      baseURL: import.meta.env.VITE_APP_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return client.post(USERS_URI, newUser)
  }

  deleteUser(id: IdType): Promise<SmileResponseType<any>> {
    return apiClient.delete(`${USERS_URI}/${id}`, {})
  }

  updateUser(
    id: IdType,
    user: SmileUserType,
  ): Promise<SmileResponseType<SmileUserType>> {
    return apiClient.put(`${USERS_URI}/${id}`, user)
  }

  getAddress(addressId: IdType): Promise<SmileResponseType<UserAddressType>> {
    return apiClient.get(`${USERS_URI}/address/${addressId}`)
  }

  getAddressList(
    userId: IdType,
  ): Promise<SmileResponseType<UserAddressType[]>> {
    return apiClient.get(`${USERS_URI}/${userId}/address`)
  }

  createAddress(
    userId: IdType,
    address: UserAddressType,
  ): Promise<SmileResponseType<SmileUserType>> {
    return apiClient.post(`${USERS_URI}/${userId}/address`, address)
  }

  deleteAddress(addressId: IdType): Promise<SmileResponseType<any>> {
    return apiClient.delete(`${USERS_URI}/address/${addressId}`)
  }

  updateAddress(
    userId: IdType,
    addressId: IdType,
    address: UserAddressType,
  ): Promise<SmileResponseType<SmileUserType>> {
    return apiClient.put(`${USERS_URI}/${userId}/address/${addressId}`, address)
  }
}

export default new UserService()

import apiClient from '@/services/HttpCommon'
import type { SmileResponseType, SmileUserType } from '@/types'

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
}

export default new UserService()

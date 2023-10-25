import apiClient from '@/services/HttpCommon.ts'

const USERS_URI = '/users'
const CURRENT_USER_URI = `${USERS_URI}/current_user`

class UserService {
  current_user(): Promise<any> {
    return apiClient.get(CURRENT_USER_URI)
  }

  user_list(): Promise<any> {
    return apiClient.get(USERS_URI)
  }
}

export default new UserService()

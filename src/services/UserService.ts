import apiClient from '@/services/HttpCommon.ts'

const CURRENT_USER_URI = '/users/current_user'

class UserService {
  current_user(): Promise<any> {
    return apiClient.get(CURRENT_USER_URI)
  }
}

export default new UserService()

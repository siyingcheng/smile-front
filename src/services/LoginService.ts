import apiClient from '@/services/HttpCommon'
import { Buffer } from 'buffer/'

class LoginService {
  login(username: string, password: string): Promise<any> {
    let authToken: string = Buffer.from(`${username}:${password}`).toString(
      'base64',
    )
    return apiClient.post(
      '/login',
      {},
      {
        headers: {
          Authorization: `Basic ${authToken}`,
        },
      },
    )
  }
}

export default new LoginService()

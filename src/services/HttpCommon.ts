import { useUserStore } from '@/stores/UserStore'
import axios, { AxiosInstance } from 'axios'
import { ElNotification } from 'element-plus'

const apiClient: AxiosInstance = axios.create({
  // baseURL: 'http://localhost:8080/api/v1',
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    if (config.url !== '/login') {
      config.headers.Authorization = `Bearer ${useUserStore().token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    ElNotification({
      type: 'error',
      message: error.response?.data?.message || 'Some Error Occured',
    })
    Promise.reject(error)
  }
)

export default apiClient

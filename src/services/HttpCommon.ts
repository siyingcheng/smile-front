import axios, { AxiosInstance } from 'axios'

const apiClient: AxiosInstance = axios.create({
  // baseURL: 'http://localhost:8080/api/v1',
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
})

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
)

export default apiClient

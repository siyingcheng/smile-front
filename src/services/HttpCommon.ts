import { useUserStore } from '@/stores/UserStore'
import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (config.url !== '/login') {
      let token = userStore.token || localStorage.getItem('token')
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

client.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem('token')
      const route = useRoute()
      useRouter().push(`/login?redirect=${route.fullPath}`)
      window.location.reload()
    }
    return Promise.reject(error)
  },
)

export default client

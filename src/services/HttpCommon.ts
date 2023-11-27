import router from '@/router'
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
    let path = router.currentRoute.value.fullPath
    if (error.response.status === 401 && path !== '/login') {
      localStorage.removeItem('token')
      router.push(`/login?redirect=${path}`)
      window.location.reload()
    }
    return Promise.reject(error)
  },
)

export default client

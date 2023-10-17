import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './routers'
// import './style.css'
import { createPinia } from 'pinia'

createApp(App).use(router).use(ElementPlus).use(createPinia()).mount('#app')

import { useUserStore } from '@/stores/UserStore'
const userStore = useUserStore()
await userStore.loadLocalUser()

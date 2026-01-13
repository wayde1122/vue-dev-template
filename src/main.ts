/**
 * Main Entry Point
 * Vue 3 应用入口 - 配置路由、状态管理、全局插件
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// 创建 Vue 应用实例
const app = createApp(App)

// 创建 Pinia 状态管理实例
const pinia = createPinia()

// 注册插件
app.use(pinia)
app.use(router)

// 挂载应用
app.mount('#app')

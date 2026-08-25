import { createRouter, createWebHistory } from 'vue-router'

import Index from './components/index.vue'
import Login from './components/login.vue'
import Register from './components/register.vue'
import History from './components/history.vue'
import Info from './components/info.vue'

const routes = [
  { path: '/', component: Index },
  { path: '/history', component: History },
  { path: '/info', component: Info },
  { path: '/login', component: Login },
  { path: '/register', component: Register }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
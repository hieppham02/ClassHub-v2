import { createRouter, createWebHistory } from 'vue-router'

import Index from './components/index.vue'
import Login from './components/login.vue'
import Register from './components/register.vue'
import History from './components/history.vue'
import Cabinet from './components/cabinet.vue'
import Info from './components/info.vue'

const routes = [
  { path: '/', component: Index },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/history', component: History },
  { path: '/cabinet', component: Cabinet },
  { path: '/info', component: Info }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
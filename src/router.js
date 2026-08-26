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
  { path: '/register', component: Register },

  // --- ADMIN ROUTES (lazy-loaded) ---
  {
    path: '/admin',
    component: () => import('./components/admin/dashboard.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/cabinets',
    component: () => import('./components/admin/cabinets.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/accounts',
    component: () => import('./components/admin/accounts.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/buildings',
    component: () => import('./components/admin/buildings.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/history',
    component: () => import('./components/admin/history-admin.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/statistics',
    component: () => import('./components/admin/statistics.vue'),
    meta: { requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// --- ROUTE GUARD ---
router.beforeEach((to, _from, next) => {
  if (!to.meta.requiresAdmin) return next()

  const saved = sessionStorage.getItem('classhub-user')
  if (!saved) return next('/login')

  try {
    const user = JSON.parse(saved)
    if (user.role === 'ADMIN') return next()
    // Người dùng thường cố vào /admin → đuổi về trang chủ
    return next('/')
  } catch {
    return next('/login')
  }
})

export default router
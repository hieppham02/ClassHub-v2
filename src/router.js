import { createRouter, createWebHistory } from 'vue-router'

import Index from './components/index.vue'
import Login from './components/login.vue'
import Register from './components/register.vue'
import LichSuMuon from './components/lich-su-muon.vue'
import ThongTinNguoiDung from './components/thong-tin-nguoi-dung.vue'

const routes = [
  { path: '/', component: Index },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/lich-su-muon', component: LichSuMuon },
  { path: '/thong-tin-nguoi-dung', component: ThongTinNguoiDung }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
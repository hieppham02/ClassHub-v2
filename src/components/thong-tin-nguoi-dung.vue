<script setup>
import { ref, onMounted } from 'vue'

const user = ref({ name: 'Nguyễn Minh Anh', role: 'Sinh viên', email: 'sinhvien@eaut.edu.vn' })
const currentPath = ref(window.location.pathname)

onMounted(() => {
  const saved = sessionStorage.getItem('eaut-user')
  if (saved) user.value = JSON.parse(saved)
})

function logout() {
  sessionStorage.removeItem('eaut-user')
  window.location.href = '/login'
}
</script>

<template>
  <main class="min-h-screen bg-mist">
    <header class="border-b border-blue-100 bg-white">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="/" class="flex items-center gap-3">
          <div class="flex size-11 items-center justify-center rounded-2xl bg-blue-50 ring-1 ring-blue-100">
            <img src="https://eaut.edu.vn/favicon.ico" alt="Logo Đại học Công nghệ Đông Á"
              class="size-8 object-contain" />
          </div>
          <div>
            <p class="font-bold text-brand">Hệ thống Mượn trả EAUT</p>
            <p class="text-xs text-slate-500">Đại học Công nghệ Đông Á</p>
          </div>
        </a>
        <nav class="hidden items-center gap-1 rounded-xl bg-blue-50 p-1 sm:flex" aria-label="Điều hướng">
          <a href="/" class="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand shadow-sm">Trang chủ</a>
          <a href="/lich-su-muon" class="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:text-brand">Lịch
            sử mượn</a>
        </nav>
      </div>
    </header>

    <section class="mx-auto max-w-3xl px-5 py-12 lg:px-8">
      <p class="text-sm font-bold uppercase tracking-[0.18em] text-brand">TÀI KHOẢN</p>
      <h1 class="mt-2 text-4xl font-bold text-ink">Thông tin người dùng</h1>
      <div class="mt-8 overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-lg shadow-blue-100">
        <div class="bg-gradient-to-r from-brand-dark to-brand p-8 text-white">
          <div
            class="flex size-20 items-center justify-center rounded-3xl bg-white/15 text-3xl font-bold ring-1 ring-white/30">
            {{ user.name.charAt(0) }}</div>
          <h2 class="mt-5 text-2xl font-bold">{{ user.name }}</h2>
          <p class="mt-1 text-blue-100">{{ user.role }}</p>
        </div>
        <div class="grid gap-5 p-8 sm:grid-cols-2">
          <div>
            <p class="text-xs font-bold uppercase tracking-wide text-slate-400">Email</p>
            <p class="mt-2 font-semibold text-ink">{{ user.email }}</p>
          </div>
          <div>
            <p class="text-xs font-bold uppercase tracking-wide text-slate-400">Trạng thái</p>
            <p class="mt-2 font-semibold text-emerald-600">Đang hoạt động</p>
          </div>
        </div>
        <div class="border-t border-blue-100 p-8">
          <button @click="logout"
            class="rounded-xl border border-red-100 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50">Đăng xuất
            tài khoản</button>
        </div>
      </div>
    </section>

    <!-- BOTTOM MENU BAR CHO MOBILE -->
    <nav
      class="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-blue-100 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)] sm:hidden">

      <!-- Icon Trang chủ -->
      <a href="/" :class="currentPath === '/' ? 'text-brand font-bold' : 'text-slate-400 font-medium'"
        class="flex flex-col items-center gap-1 transition hover:text-brand">
        <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span class="text-[10px]">Trang chủ</span>
      </a>

      <!-- Icon Lịch sử -->
      <a href="/lich-su-muon"
        :class="currentPath.includes('/lich-su') ? 'text-brand font-bold' : 'text-slate-400 font-medium'"
        class="flex flex-col items-center gap-1 transition hover:text-brand">
        <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-[10px]">Lịch sử</span>
      </a>

      <!-- Icon Tài khoản -->
      <a href="/thong-tin-nguoi-dung"
        :class="currentPath.includes('/thong-tin') ? 'text-brand font-bold' : 'text-slate-400 font-medium'"
        class="flex flex-col items-center gap-1 transition hover:text-brand">
        <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span class="text-[10px]">Tài khoản</span>
      </a>

    </nav>

  </main>
</template>
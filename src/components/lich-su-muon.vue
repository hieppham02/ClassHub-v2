<script setup>
import { ref, onMounted } from 'vue'

const history = ref([])
const user = ref({ name: 'Nguyễn Minh Anh', role: 'Sinh viên' })

function logout() { 
  sessionStorage.removeItem('eaut-user')
  window.location.href = '/login' 
}

onMounted(() => { 
  history.value = JSON.parse(sessionStorage.getItem('eaut-bookings') || '[]') 
})
</script>

<template>
  <main class="min-h-screen bg-mist">
    <header class="border-b border-blue-100 bg-white">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="/" class="flex items-center gap-3">
          <div class="flex size-11 items-center justify-center rounded-2xl bg-blue-50 ring-1 ring-blue-100">
            <img src="https://eaut.edu.vn/favicon.ico" alt="Logo Đại học Công nghệ Đông Á" class="size-8 object-contain" />
          </div>
          <div>
            <p class="font-bold text-brand">Hệ thống Mượn trả EAUT</p>
            <p class="text-xs text-slate-500">Đại học Công nghệ Đông Á</p>
          </div>
        </a>
        <nav class="flex items-center gap-1 rounded-xl bg-blue-50 p-1">
          <a href="/" class="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:text-brand">Trang chủ</a>
          <a href="/lich-su-muon" class="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand shadow-sm">Lịch sử mượn</a>
        </nav>
        <div class="hidden items-center gap-3 sm:flex">
          <a href="/thong-tin-nguoi-dung" class="text-right hover:opacity-80">
            <p class="text-sm font-semibold text-ink">Nguyễn Minh Anh</p>
            <p class="text-xs text-slate-500">Sinh viên</p>
          </a>
          <button type="button" class="rounded-lg border border-blue-100 px-3 py-2 text-xs font-bold text-brand hover:bg-blue-50" @click="logout">Đăng xuất</button>
        </div>
      </div>
    </header>

    <div class="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <p class="text-sm font-semibold text-brand">QUẢN LÝ ĐĂNG KÝ</p>
      <h1 class="mt-2 text-4xl font-bold text-ink">Lịch sử mượn phòng</h1>
      <p class="mt-3 text-slate-500">Theo dõi các lượt đăng ký sử dụng phòng của bạn.</p>

      <div v-if="!history.length" class="mt-10 rounded-3xl border border-dashed border-blue-200 bg-white p-12 text-center">
        <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-brand">⌁</div>
        <h2 class="text-lg font-bold text-ink">Chưa có lượt mượn nào</h2>
        <p class="mt-2 text-sm text-slate-500">Các lượt đăng ký mới sẽ xuất hiện tại đây.</p>
        <a href="/" class="mt-6 inline-flex rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-dark">Đăng ký phòng ngay</a>
      </div>

      <div v-else class="mt-8 grid gap-4">
        <div v-for="(item, index) in history" :key="index" class="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-lg font-bold text-ink">{{ item.room }}</p>
            <p class="mt-1 text-sm text-slate-500">{{ item.building }} · {{ item.date }} · {{ item.slot }}</p>
          </div>
          <span class="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">{{ item.status }}</span>
        </div>
      </div>
    </div>
  </main>
</template>
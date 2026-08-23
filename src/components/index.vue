<script setup>
// 1. Đã nạp đủ thư viện của Vue
import { ref, onMounted, computed } from 'vue'

const rooms = [
  { id: 501, building: 'Tòa A', floor: 'Tầng 5', capacity: 60, equipment: ['Máy chiếu', 'Điều hòa', 'Micro'], tone: 'from-blue-600 to-cyan-500' },
  { id: 502, building: 'Tòa A', floor: 'Tầng 5', capacity: 45, equipment: ['Máy chiếu', 'Điều hòa'], tone: 'from-indigo-600 to-blue-500' },
  { id: 601, building: 'Tòa B', floor: 'Tầng 6', capacity: 80, equipment: ['Máy chiếu', 'Điều hòa', 'Micro'], tone: 'from-sky-600 to-blue-500' },
  { id: 602, building: 'Tòa B', floor: 'Tầng 6', capacity: 35, equipment: ['Máy chiếu', 'Điều hòa'], tone: 'from-blue-700 to-indigo-500' },
]

const building = ref('Tất cả tòa') 
const date = ref('2026-08-25') 
const slot = ref('Ca 1') 
const selected = ref(null) 
const booked = ref([]) 
const showToast = ref(false) 
const user = ref({ name: 'Nguyễn Minh Anh', role: 'Sinh viên' })

function logout() { 
  sessionStorage.removeItem('eaut-user')
  // 2. Đã sửa hàm chuyển trang của Nuxt thành hàm thuần của trình duyệt
  window.location.href = '/login' 
}

onMounted(() => { 
  const saved = sessionStorage.getItem('eaut-user')
  if (saved) user.value = JSON.parse(saved) 
})

const filtered = computed(() => 
  building.value === 'Tất cả tòa' ? rooms : rooms.filter(r => r.building === building.value)
)

function book(room) { 
  if (!booked.value.includes(room.id)) { 
    booked.value.push(room.id)
    selected.value = null
    showToast.value = true
    setTimeout(() => showToast.value = false, 3000) 
  } 
}
</script>

<template>
  <main class="min-h-screen bg-mist">
    <header class="border-b border-blue-100 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <!-- 3. Đã đổi toàn bộ <NuxtLink> thành thẻ <a> thông thường -->
        <a href="/" class="flex items-center gap-3">
          <div class="flex size-11 items-center justify-center rounded-2xl bg-blue-50 ring-1 ring-blue-100">
            <img src="https://eaut.edu.vn/favicon.ico" alt="Logo EAUT" class="size-8 object-contain" />
          </div>
          <div>
            <p class="font-bold tracking-tight text-brand">Hệ thống Mượn trả EAUT</p>
            <p class="text-xs text-slate-500">Đại học Công nghệ Đông Á</p>
          </div>
        </a>
        <nav class="flex items-center gap-1 rounded-xl bg-blue-50 p-1" aria-label="Điều hướng">
          <a href="/" class="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand shadow-sm">Trang chủ</a>
          <a href="/lich-su-muon" class="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:text-brand">Lịch sử mượn</a>
        </nav>
        <div class="hidden items-center gap-3 sm:flex">
          <a href="/thong-tin-nguoi-dung" class="text-right hover:opacity-80">
            <p class="text-sm font-semibold text-ink">{{ user.name }}</p>
            <p class="text-xs text-slate-500">{{ user.role }}</p>
          </a>
          <button type="button" class="rounded-lg border border-blue-100 px-3 py-2 text-xs font-bold text-brand hover:bg-blue-50" @click="logout">Đăng xuất</button>
        </div>
      </div>
    </header>

    <section class="mx-auto max-w-7xl px-5 pb-8 pt-10 lg:px-8 lg:pt-14">
      <div class="overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-dark via-brand to-sky-500 p-7 text-white shadow-xl shadow-blue-200 sm:p-10">
        <div class="max-w-2xl">
          <p class="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">Không gian học tập của bạn</p>
          <h1 class="text-3xl font-bold tracking-tight sm:text-5xl">Mượn phòng dễ dàng,<br /><span class="text-cyan-100">học tập hiệu quả hơn.</span></h1>
          <p class="mt-5 max-w-xl text-sm leading-6 text-blue-100">Chọn thời gian, tìm phòng phù hợp và đăng ký sử dụng chỉ trong vài thao tác.</p>
        </div>
      </div>
    </section>

    <div class="mx-auto max-w-7xl px-5 pb-14 lg:px-8">
      <section class="-mt-2 mb-9 rounded-2xl border border-blue-100 bg-white p-4 shadow-lg shadow-blue-100/60 sm:p-5">
        <div class="grid gap-4 sm:grid-cols-3">
          <label class="grid gap-2 text-sm font-semibold text-ink">Ngày mượn
            <input v-model="date" type="date" class="h-11 rounded-xl border border-blue-100 bg-mist px-3 text-sm outline-none focus:ring-2 focus:ring-brand" />
          </label>
          <label class="grid gap-2 text-sm font-semibold text-ink">Ca học
            <select v-model="slot" class="h-11 rounded-xl border border-blue-100 bg-mist px-3 text-sm outline-none focus:ring-2 focus:ring-brand">
              <option v-for="n in 6" :key="n">Ca {{ n }}</option>
            </select>
          </label>
          <label class="grid gap-2 text-sm font-semibold text-ink">Tòa nhà
            <select v-model="building" class="h-11 rounded-xl border border-blue-100 bg-mist px-3 text-sm outline-none focus:ring-2 focus:ring-brand">
              <option>Tất cả tòa</option><option>Tòa A</option><option>Tòa B</option>
            </select>
          </label>
        </div>
      </section>

      <div class="mb-5 flex items-end justify-between">
        <div>
          <p class="text-sm font-semibold text-brand">DANH SÁCH PHÒNG</p>
          <h2 class="mt-1 text-2xl font-bold text-ink">Phòng học khả dụng</h2>
        </div>
        <span class="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-brand">{{ filtered.length }} phòng</span>
      </div>

      <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <article v-for="room in filtered" :key="room.id" class="group overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100">       
          <div class="p-5">
            <div class="mb-5 flex items-start justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">{{ room.building }} · {{ room.floor }}</p>
                <h3 class="mt-1 text-xl font-bold text-ink">Phòng {{ room.id }}</h3>
              </div>
              <span :class="booked.includes(room.id) ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-700'" class="rounded-full px-2.5 py-1 text-xs font-semibold">{{ booked.includes(room.id) ? 'Đã đăng ký' : 'Đang trống' }}</span>
            </div>
            <div class="mb-5 flex items-center gap-2 border-b border-blue-50 pb-4 text-sm text-slate-500">
              <span class="text-lg">◉</span>Sức chứa <b class="text-ink">{{ room.capacity }} người</b>
            </div>
            <div class="mb-6 flex flex-wrap gap-2">
              <span v-for="item in room.equipment" :key="item" class="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-brand">{{ item }}</span>
            </div>
            <button :disabled="booked.includes(room.id)" @click="selected = room" class="h-11 w-full rounded-xl bg-brand text-sm font-bold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400">{{ booked.includes(room.id) ? 'Đã đăng ký' : 'Đăng ký mượn phòng' }}</button>
          </div>
        </article>
      </div>
    </div>

    <!-- Modal Popup -->
    <div v-if="selected" class="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-5 backdrop-blur-sm" @click.self="selected = null">
      <div class="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <p class="text-sm font-semibold text-brand">CHI TIẾT PHÒNG</p>
        <h2 class="mt-1 text-2xl font-bold text-ink">Phòng {{ selected.id }}</h2>
        <p class="mt-4 leading-6 text-slate-500">{{ selected.building }} · {{ selected.floor }} · Sức chứa {{ selected.capacity }} người. Thiết bị: {{ selected.equipment.join(', ') }}.</p>
        <div class="mt-6 flex gap-3">
          <button @click="selected = null" class="h-11 flex-1 rounded-xl border border-blue-100 font-semibold text-slate-500">Đóng</button>
          <button @click="book(selected)" class="h-11 flex-1 rounded-xl bg-brand font-bold text-white">Xác nhận mượn</button>
        </div>
      </div>
    </div>

    <!-- Toast Thông báo -->
    <div v-if="showToast" class="fixed bottom-5 right-5 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white shadow-xl" role="status">
      Đăng ký mượn phòng thành công.
    </div>
  </main>
</template>
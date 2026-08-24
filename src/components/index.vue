<script setup>
import { ref, onMounted, computed } from 'vue'

const rooms = ref([])

const url = import.meta.env.VITE_API_URL
const building = ref('Tất cả tòa')
const date = ref(new Date().toISOString().split('T')[0])
const slot = ref('Chọn ca học')
const danhSachCaHoc = [
  'Ca 1 (07:00 - 09:30)',
  'Ca 2 (09:40 - 12:10)',
  'Ca 3 (13:00 - 15:30)',
  'Ca 4 (15:40 - 18:10)',
  'Ca 5 (18:10 - 20:40)'
]
const selected = ref(null)
const booked = ref([])
const showToast = ref(false)
const currentPath = ref(window.location.pathname)
const user = ref({ name: '', role: '' })
const showMissingSlotModal = ref(false)

function logout() {
  sessionStorage.removeItem('classhub-token')
  sessionStorage.removeItem('classhub-user')
  window.location.href = '/login'
}

async function fetchRooms() {
  try {
    const token = sessionStorage.getItem('classhub-token')

    const response = await fetch(url + '/rooms/get-rooms', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      if (response.status === 401) logout()
      return
    }

    rooms.value = await response.json()
  } catch (err) {
    console.error('Lỗi tải danh sách phòng:', err)
  }
}

onMounted(() => {
  const saved = sessionStorage.getItem('classhub-user')
  const token = sessionStorage.getItem('classhub-token')

  if (token == null || saved == null) {
    sessionStorage.removeItem('classhub-token')
    sessionStorage.removeItem('classhub-user')
    window.location.href = '/login'
    return
  }

  if (saved && token) {
    user.value = JSON.parse(saved)
    if (user.value.role == "SINHVIEN") {
      user.value.role = "Sinh viên";
    }
    if (user.value.role == "GIANGVIEN") {
      user.value.role = "Giảng viên";
    }
  } else {
    window.location.href = '/login'
  }

  fetchRooms()
})

const filtered = computed(() =>
  building.value === 'Tất cả tòa' ? rooms.value : rooms.value.filter(r => r.building === building.value)
)

const uniqueBuildings = computed(() => {
  const buildings = new Set(rooms.value.map(r => r.building))
  return ['Tất cả tòa', ...Array.from(buildings)]
})

const groupedRooms = computed(() => {
  const groups = {}
  filtered.value.forEach(room => {
    if (!groups[room.building]) {
      groups[room.building] = []
    }
    groups[room.building].push(room)
  })
  return groups
})

async function book(room) {
  if (slot.value === 'Chọn ca học') {
    showMissingSlotModal.value = true
    return;
  }

  const [year, month, day] = date.value.split('-');
  const ngayMuonFormat = `${day}-${month}-${year}`;

  const caSo = parseInt(slot.value.match(/\d+/)[0]);

  try {
    const token = sessionStorage.getItem('classhub-token');

    const response = await fetch(url + '/booking/dat-phong', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        maPhong: room.id,
        ngayMuon: ngayMuonFormat,
        caMuon: caSo
      })
    });

    if (response.ok) {
      selected.value = null;
      window.location.href = '/history';
    } else {
      const data = await response.json();
      alert(data.message || 'Lỗi hệ thống, không thể đặt phòng!');
    }
  } catch (err) {
    console.error('Lỗi khi gọi API đặt phòng:', err);
    alert('Không thể kết nối tới server');
  }
}

</script>

<template>
  <div v-if="showMissingSlotModal"
    class="fixed inset-0 z-[70] flex items-center justify-center bg-ink/40 p-5 backdrop-blur-sm"
    @click.self="showMissingSlotModal = false">
    <div class="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
      <div class="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
        <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 class="text-xl font-bold text-ink">Vui lòng chọn ca học</h2>
      <button @click="showMissingSlotModal = false; selected = null"
        class="mt-6 h-11 w-full rounded-xl bg-brand font-bold text-white transition hover:bg-brand-dark">Đã
        hiểu</button>
    </div>
  </div>

  <main class="min-h-screen bg-mist pb-20 sm:pb-0">
    <header class="border-b border-blue-100 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="/" class="flex items-center gap-3">
          <div class="flex size-11 items-center justify-center rounded-2xl bg-blue-50 ring-1 ring-blue-100">
            <img src="https://eaut.edu.vn/favicon.ico" alt="Logo EAUT" class="size-8 object-contain" />
          </div>
          <div>
            <p class="font-bold tracking-tight text-brand">Class Hub</p>
            <p class="text-xs text-slate-500">Đại học Công nghệ Đông Á</p>
          </div>
        </a>

        <nav class="hidden items-center gap-1 rounded-xl bg-blue-50 p-1 sm:flex" aria-label="Điều hướng">
          <a href="/" class="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand shadow-sm">Trang chủ</a>
          <a href="/history" class="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:text-brand">Lịch
            sử mượn</a>
        </nav>
        <div class="hidden items-center gap-3 sm:flex">
          <a href="/info" class="text-right hover:opacity-80">
            <p class="text-sm font-semibold text-ink">{{ user.name }}</p>
            <p class="text-xs text-slate-500">{{ user.role }}</p>
          </a>
          <button type="button"
            class="rounded-lg border border-blue-100 px-3 py-2 text-xs font-bold text-brand hover:bg-blue-50"
            @click="logout">Đăng xuất</button>
        </div>
      </div>
    </header>

    <section class="mx-auto max-w-7xl px-5 pb-8 pt-10 lg:px-8 lg:pt-14">
      <div
        class="overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-dark via-brand to-sky-500 p-7 text-white shadow-xl shadow-blue-200 sm:p-10">
        <div class="max-w-2xl">
          <p class="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">Không gian học tập của bạn</p>
          <h1 class="text-3xl font-bold tracking-tight sm:text-5xl">Mượn phòng dễ dàng,<br /><span
              class="text-cyan-100">học tập hiệu quả hơn.</span></h1>
          <p class="mt-5 max-w-xl text-sm leading-6 text-blue-100">Chọn thời gian, tìm phòng phù hợp và đăng ký sử dụng
            chỉ trong vài thao tác.</p>
        </div>
      </div>
    </section>

    <div class="mx-auto max-w-7xl px-5 pb-14 lg:px-8">
      <section class="-mt-2 mb-9 rounded-2xl border border-blue-100 bg-white p-4 shadow-lg shadow-blue-100/60 sm:p-5">
        <div class="grid gap-4 sm:grid-cols-3">
          <label class="grid gap-2 text-sm font-semibold text-ink">Ngày mượn
            <input v-model="date" type="date"
              class="h-11 rounded-xl border border-blue-100 bg-mist px-3 text-sm outline-none focus:ring-2 focus:ring-brand" />
          </label>
          <label class="grid gap-2 text-sm font-semibold text-ink">Ca học
            <select v-model="slot"
              class="h-11 rounded-xl border border-blue-100 bg-mist px-3 text-sm outline-none focus:ring-2 focus:ring-brand">
              <option disabled value="Chọn ca học">Chọn ca học</option>
              <option v-for="(ca, index) in danhSachCaHoc" :key="index" :value="ca">
                {{ ca }}
              </option>
            </select>
          </label>
          <label class="grid gap-2 text-sm font-semibold text-ink">Tòa nhà
            <select v-model="building"
              class="h-11 rounded-xl border border-blue-100 bg-mist px-3 text-sm outline-none focus:ring-2 focus:ring-brand">
              <option v-for="b in uniqueBuildings" :key="b" :value="b">{{ b }}</option>
            </select>
          </label>
        </div>
      </section>

      <template v-for="(roomsInBuilding, buildingName) in groupedRooms" :key="buildingName">
        <div class="mb-5 mt-10 flex items-end justify-between first:mt-0">
          <div>
            <h2 class="mt-1 text-2xl font-bold text-ink">{{ buildingName }}</h2>
          </div>
          <span class="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-brand">{{ roomsInBuilding.length }}
            phòng</span>
        </div>

        <div class="mb-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <article v-for="room in roomsInBuilding" :key="room.id"
            class="group overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100">
            <div class="p-5">
              <div class="mb-5 flex items-start justify-between">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">{{ room.floor }}</p>
                  <h3 class="mt-1 text-xl font-bold text-ink">{{ room.name }}</h3>
                </div>
                <span
                  :class="booked.includes(room.id) ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-700'"
                  class="rounded-full px-2.5 py-1 text-xs font-semibold">{{ booked.includes(room.id) ? 'Đã đăng ký' :
                    'Đang trống' }}</span>
              </div>
              <div class="mb-5 flex items-center gap-2 border-b border-blue-50 pb-4 text-sm text-slate-500">
                <span class="text-lg">◉</span>Sức chứa <b class="text-ink">{{ room.capacity }} người</b>
              </div>
              <div class="mb-6 flex flex-wrap gap-2">
                <span v-for="item in room.equipment" :key="item"
                  class="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-brand">{{ item }}</span>
              </div>
              <button :disabled="booked.includes(room.id)" @click="selected = room"
                class="h-11 w-full rounded-xl bg-brand text-sm font-bold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400">{{
                  booked.includes(room.id) ? 'Đã đăng ký' : 'Đăng ký mượn phòng' }}</button>
            </div>
          </article>
        </div>
      </template>
    </div>

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
      <a href="/history"
        :class="currentPath.includes('/history') ? 'text-brand font-bold' : 'text-slate-400 font-medium'"
        class="flex flex-col items-center gap-1 transition hover:text-brand">
        <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-[10px]">Lịch sử</span>
      </a>

      <!-- Icon Tài khoản -->
      <a href="/info"
        :class="currentPath.includes('/info') ? 'text-brand font-bold' : 'text-slate-400 font-medium'"
        class="flex flex-col items-center gap-1 transition hover:text-brand">
        <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span class="text-[10px]">Tài khoản</span>
      </a>

    </nav>

    <!-- Modal Popup -->
    <div v-if="selected" class="fixed inset-0 z-[60] flex items-center justify-center bg-ink/40 p-5 backdrop-blur-sm"
      @click.self="selected = null">
      <div class="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <p class="text-sm font-semibold text-brand">CHI TIẾT PHÒNG</p>
        <h2 class="mt-1 text-2xl font-bold text-ink">Phòng {{ selected.id }}</h2>
        <p class="mt-4 leading-6 text-slate-500">{{ selected.building }} · {{ selected.floor }} · Sức chứa {{
          selected.capacity }} người. Thiết bị: {{ selected.equipment.join(', ') }}.</p>
        <div class="mt-6 flex gap-3">
          <button @click="selected = null"
            class="h-11 flex-1 rounded-xl border border-blue-100 font-semibold text-slate-500">Đóng</button>
          <button @click="book(selected)" class="h-11 flex-1 rounded-xl bg-brand font-bold text-white">Xác nhận
            mượn</button>
        </div>
      </div>
    </div>

    <!-- Toast Thông báo -->
    <div v-if="showToast"
      class="fixed bottom-20 right-5 z-[60] rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white shadow-xl sm:bottom-5"
      role="status">
      Đăng ký mượn phòng thành công.
    </div>
  </main>
</template>
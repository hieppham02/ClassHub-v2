<script setup>
import { ref, onMounted } from 'vue'

const url = import.meta.env.VITE_API_URL
const history = ref([])
const user = ref({ name: '', role: '' })
const currentPath = ref(window.location.pathname)

const showToast = ref(false)
const toastMessage = ref('Thành công')
const showErrorToast = ref(false)
const errorMessage = ref('')
const confirmReturnId = ref(null)

function logout() {
  sessionStorage.removeItem('classhub-token')
  sessionStorage.removeItem('classhub-user')
  window.location.href = '/login'
}

function showSuccessToast(msg) {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

function triggerError(msg) {
  errorMessage.value = msg
  showErrorToast.value = true
  setTimeout(() => showErrorToast.value = false, 3000)
}

async function fetchHistory() {
  const token = sessionStorage.getItem('classhub-token')
  try {
    const response = await fetch(url + '/history/get-history', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (response.ok) {
      const data = await response.json()
      history.value = data.map(item => ({ ...item, otpValue: '' }))
    } else {
      if (response.status === 401) logout()
    }
  } catch (err) {
    console.error('Lỗi khi lấy lịch sử:', err)
  }
}


async function openDoor(id, otp) {
  if (!otp) {
    triggerError('Vui lòng nhập mã OTP để mở tủ!')
    return
  }

  const token = sessionStorage.getItem('classhub-token')
  try {
    const response = await fetch(url + `/cabinet/open-door/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ otp: otp })
    })

    if (response.ok) {
      showSuccessToast('Đã gửi lệnh mở cửa tủ thành công!')

      // Tìm phiếu mượn vừa thao tác và gán thêm biến trạng thái để hiện UI
      const index = history.value.findIndex(item => item.id === id)
      if (index !== -1) {
        history.value[index].isCabinetOpen = true
      }

    } else {
      const data = await response.json()
      triggerError(data?.message || 'Mã OTP không hợp lệ')
    }
  } catch (err) {
    console.error('Lỗi khi mở tủ:', err)
    triggerError('Không thể kết nối tới server')
  }
}

async function returnRoom(id) {
  confirmReturnId.value = null

  const token = sessionStorage.getItem('classhub-token')
  try {
    const response = await fetch(url + `/booking/return-room/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (response.ok) {
      showSuccessToast('Trả thiết bị thành công')
      fetchHistory()
    } else {
      const data = await response.json()
      triggerError(data?.message || 'Có lỗi xảy ra')
    }
  } catch (err) {
    console.error('Lỗi khi trả phòng:', err)
    triggerError('Không thể kết nối tới server')
  }
}

function getRoomToReturn(id) {
  confirmReturnId.value = id
}

async function resendOtp(id) {
  const token = sessionStorage.getItem('classhub-token')
  try {
    const response = await fetch(url + `/history/refresh-otp/${id}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (response.ok) {
      showSuccessToast('Đã gửi lệnh cấp lại OTP tới tủ thiết bị!')
    } else {
      const data = await response.json()
      triggerError(data?.message || 'Có lỗi khi cấp lại OTP')
    }
  } catch (err) {
    console.error('Lỗi khi gửi lại OTP:', err)
    triggerError('Không thể kết nối tới server')
  }
}

onMounted(() => {
  const token = sessionStorage.getItem('classhub-token')
  const saved = sessionStorage.getItem('classhub-user')

  if (!token || !saved) {
    logout()
    return
  }

  user.value = JSON.parse(saved)
  fetchHistory()
})
</script>

<template>
  <!-- Modal Xác Nhận Trả -->
  <div v-if="confirmReturnId"
    class="fixed inset-0 z-[70] flex items-center justify-center bg-ink/40 p-5 backdrop-blur-sm"
    @click.self="confirmReturnId = null">
    <div class="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
      <div class="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-blue-50 text-brand">
        <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
      </div>
      <h2 class="text-xl font-bold text-ink">Xác nhận trả</h2>
      <p class="mt-2 text-sm text-slate-500">Bạn có chắc chắn muốn trả phòng và thiết bị này không?</p>
      <div class="mt-6 flex gap-3">
        <button @click="confirmReturnId = null"
          class="h-11 flex-1 rounded-xl border border-blue-100 font-semibold text-slate-500 transition hover:bg-slate-50">Hủy</button>
        <!-- Chỉnh lại chỗ này cho sạch, gọi hàm thẳng luôn -->
        <button @click="returnRoom(confirmReturnId)"
          class="h-11 flex-1 rounded-xl bg-brand font-bold text-white transition hover:bg-brand-dark">Xác nhận</button>
      </div>
    </div>
  </div>

  <!-- Toast Thành Công (Nhận text động) -->
  <div v-if="showToast"
    class="fixed bottom-20 right-5 z-[60] rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-xl sm:bottom-5 transition-all"
    role="status">
    ✓ {{ toastMessage }}
  </div>

  <!-- Toast Lỗi -->
  <div v-if="showErrorToast"
    class="fixed bottom-20 right-5 z-[60] rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-xl sm:bottom-5 transition-all"
    role="status">
    ✕ {{ errorMessage }}
  </div>

  <main class="min-h-screen bg-mist pb-20 sm:pb-0">
    <!-- KHỐI HEADER GIỮ NGUYÊN -->
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
          <a href="/" class="rounded-lg px-4 py-2 text-sm transition"
            :class="currentPath === '/' ? 'bg-white font-bold text-brand shadow-sm' : 'font-medium text-slate-500 hover:text-brand'">Trang
            chủ</a>
          <a href="/history" class="rounded-lg px-4 py-2 text-sm transition"
            :class="currentPath.includes('/history') ? 'bg-white font-bold text-brand shadow-sm' : 'font-medium text-slate-500 hover:text-brand'">Lịch
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

    <!-- KHỐI DANH SÁCH LỊCH SỬ -->
    <div class="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <h1 class="mt-2 text-4xl font-bold text-ink">Lịch sử mượn phòng</h1>

      <div v-if="!history.length"
        class="mt-10 rounded-3xl border border-dashed border-blue-200 bg-white p-12 text-center">
        <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-brand">⌁
        </div>
        <h2 class="text-lg font-bold text-ink">Chưa có lượt mượn nào</h2>
        <p class="mt-2 text-sm text-slate-500">Các lượt đăng ký mới sẽ xuất hiện tại đây.</p>
        <a href="/"
          class="mt-6 inline-flex rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-dark">Đăng
          ký phòng ngay</a>
      </div>

      <div v-else class="mt-8 grid gap-4">
        <!-- Vòng lặp các phiếu mượn -->
        <div v-for="item in history" :key="item.id"
          class="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">

          <!-- Nửa trái: Thông tin -->
          <div class="shrink-0">
            <div class="flex items-center gap-3">
              <p class="text-lg font-bold text-ink">{{ item.name }}</p>

              <span v-if="item.status === 'COMPLETED'"
                class="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">ĐÃ TRẢ</span>
              <span v-else-if="item.status === 'CANCELED'"
                class="rounded-full bg-red-50 px-2 py-1 text-[10px] font-bold text-red-600">ĐÃ HỦY</span>

              <template v-else>
                <span class="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600">ĐANG
                  MƯỢN</span>

                <span v-if="item.isCabinetOpen"
                  class="animate-pulse rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-600 shadow-sm ring-1 ring-amber-200">TỦ
                  ĐANG MỞ</span>
              </template>
            </div>
            <p class="mt-1 text-sm text-slate-500">{{ item.building }} · Ngày: {{ item.date }} · {{ item.slot }}</p>
          </div>

          <!-- Nửa phải: Khu vực thao tác (OTP + Các nút bấm) -->
          <div v-if="item.status !== 'COMPLETED' && item.status !== 'CANCELED'"
            class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">

            <!-- Nhóm chức năng IoT -->
            <div class="flex w-full gap-2 sm:w-auto">
              <!-- Ô Nhập OTP -->
              <input v-model="item.otpValue" type="text" placeholder="Mã OTP" maxlength="6"
                class="h-11 min-w-[100px] flex-1 rounded-xl border border-blue-200 bg-slate-50 px-3 text-center text-sm font-bold tracking-widest text-ink outline-none focus:border-brand focus:ring-1 focus:ring-brand sm:w-28" />

              <!-- Nút A: Resend OTP (Gắn icon vòng lặp) -->
              <button @click="resendOtp(item.id)"
                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-white text-slate-500 transition hover:bg-blue-50 hover:text-brand"
                title="Gửi lại OTP">
                <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>

              <!-- Nút B: Mở tủ (Gắn icon ổ khóa) -->
              <button @click="openDoor(item.id, item.otpValue)"
                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink text-white shadow-md transition hover:bg-slate-800"
                title="Mở tủ thiết bị">
                <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </button>
            </div>

            <!-- Nút Trả thiết bị -->
            <button @click="getRoomToReturn(item.id)"
              class="h-11 w-full shrink-0 rounded-xl border border-blue-200 bg-white px-5 text-sm font-bold text-brand shadow-sm transition hover:bg-blue-50 sm:w-auto">
              Trả thiết bị
            </button>
          </div>

        </div>
      </div>
    </div>

    <nav
      class="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-blue-100 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)] sm:hidden">
      <a href="/" :class="currentPath === '/' ? 'text-brand font-bold' : 'text-slate-400 font-medium'"
        class="flex flex-col items-center gap-1 transition hover:text-brand">
        <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span class="text-[10px]">Trang chủ</span>
      </a>
      <a href="/history"
        :class="currentPath.includes('/history') ? 'text-brand font-bold' : 'text-slate-400 font-medium'"
        class="flex flex-col items-center gap-1 transition hover:text-brand">
        <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-[10px]">Lịch sử</span>
      </a>
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
  </main>
</template>
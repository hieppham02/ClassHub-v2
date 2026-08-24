<script setup>
import { ref, onMounted, computed } from 'vue'

const url = import.meta.env.VITE_API_URL
const currentPath = ref(window.location.pathname)
const user = ref({ name: '', role: '' })
const activeBooking = ref(null)
const cabinets = ref([])

const showToast = ref(false)
const toastMessage = ref('')
const showErrorToast = ref(false)
const errorMessage = ref('')

const selectedCabinet = ref(null) 
const otpValue = ref('')
const delegateId = ref('')

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

// 1. Lấy dữ liệu Map tủ thiết bị (Có thể dùng chung API get-rooms)
async function fetchCabinets() {
  try {
    const token = sessionStorage.getItem('classhub-token')
    // Mock API: Lấy danh sách phòng để vẽ Map. 
    // Trong thực tế, Backend trả về list phòng kèm tầng để group.
    const response = await fetch(url + '/rooms/get-rooms', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (response.ok) {
      cabinets.value = await response.json()
    }
  } catch (err) {
    console.error('Lỗi tải map tủ:', err)
  }
}

// 2. Lấy phiên mượn hiện tại của User (PENDING hoặc IN_USE)
async function fetchActiveSession() {
  try {
    const token = sessionStorage.getItem('classhub-token')
    // Cần 1 API mới ở BE để lấy phiếu mượn ĐANG ACTIVE của user
    const response = await fetch(url + '/history/get-active-session', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (response.ok) {
      activeBooking.value = await response.json()
    }
  } catch (err) {
    console.error('Lỗi tải session:', err)
  }
}

// Nhóm tủ theo tầng (dựa trên bản vẽ Map)
const groupedByFloor = computed(() => {
  const groups = {}
  cabinets.value.forEach(cab => {
    const floor = cab.floor || 'Tầng 1'
    if (!groups[floor]) groups[floor] = []
    groups[floor].push(cab)
  })
  return groups
})

// Mở Modal nếu click đúng tủ của mình
function handleCabinetClick(cabinet) {
  if (activeBooking.value && activeBooking.value.room === cabinet.id) {
    selectedCabinet.value = cabinet
    otpValue.value = ''
  } else {
    triggerError('Bạn không có quyền truy cập tủ này!')
  }
}

// Nghiệp vụ IoT (Mở cửa, Resend OTP, Trả đồ) - Chuyển từ history.vue sang
async function openDoor() {
  if (!otpValue.value) return triggerError('Vui lòng nhập OTP!')
  // ... Logic fetch API open-door như cũ ...
  showSuccessToast('Đã gửi lệnh mở cửa!')
  selectedCabinet.value = null
}

async function resendOtp() {
  // ... Logic fetch API refresh-otp như cũ ...
  showSuccessToast('Đã cấp lại OTP!')
}

async function delegateAccess() {
  if (!delegateId.value) return triggerError('Nhập mã Sinh viên!')
  // Gọi API phân quyền
  showSuccessToast(`Đã ủy quyền cho ${delegateId.value}`)
  delegateId.value = ''
}

async function revokeAccess() {
  // Gọi API thu hồi quyền
  showSuccessToast('Đã thu hồi quyền!')
}

onMounted(() => {
  const token = sessionStorage.getItem('classhub-token')
  const saved = sessionStorage.getItem('classhub-user')
  if (!token || !saved) return logout()
  
  user.value = JSON.parse(saved)
  fetchCabinets()
  fetchActiveSession()
})
</script>

<template>
  <main class="min-h-screen bg-mist pb-20 sm:pb-0">
    <!-- KHỐI HEADER KẾ THỪA TỪ SOURCE -->
    <header class="border-b border-blue-100 bg-white">
      <!-- ... (Giữ nguyên header) ... -->
    </header>

    <div class="mx-auto max-w-5xl px-5 py-8 lg:px-8">
      
      <!-- KHU VỰC 1: MAP TỦ THIẾT BỊ (Mô phỏng hình vẽ Tòa A -> Tầng n) -->
      <section class="mb-10 rounded-3xl border border-blue-200 bg-white p-6 shadow-sm">
        <h1 class="mb-6 text-center text-2xl font-black uppercase text-ink">Bản đồ Tủ thiết bị Tòa A</h1>
        
        <div class="flex flex-col-reverse gap-8"> <!-- Flex reverse để Tầng cao ở trên -->
          <div v-for="(cabs, floor) in groupedByFloor" :key="floor" class="border-b border-dashed border-blue-100 pb-6 last:border-0">
            <h2 class="mb-4 text-lg font-bold text-slate-500">{{ floor }}</h2>
            
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5">
              <!-- Render từng ô tủ -->
              <div v-for="cab in cabs" :key="cab.id" 
                @click="handleCabinetClick(cab)"
                :class="[
                  'group flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 transition-all',
                  activeBooking?.room === cab.id 
                    ? 'border-brand bg-brand-dark shadow-lg shadow-brand/30 hover:bg-brand' 
                    : 'border-slate-200 bg-slate-50 hover:border-brand/50 hover:bg-white'
                ]">
                <svg :class="activeBooking?.room === cab.id ? 'text-white' : 'text-slate-300'" class="mb-2 size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <span :class="activeBooking?.room === cab.id ? 'text-white' : 'text-slate-500'" class="text-sm font-bold">{{ cab.name }}</span>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      <!-- KHU VỰC 2: QUẢN LÝ ỦY QUYỀN (Tách biệt khỏi Map tủ) -->
      <section v-if="activeBooking" class="rounded-3xl border border-amber-200 bg-amber-50/50 p-6">
        <h3 class="flex items-center gap-2 text-lg font-bold text-amber-900">
          <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          Ủy quyền trả thiết bị
        </h3>
        <p class="mt-1 text-sm text-amber-700">Cấp quyền cho người khác mở tủ và trả thiết bị giúp bạn.</p>
        
        <div class="mt-4 flex flex-col gap-3 sm:flex-row">
          <input v-model="delegateId" type="text" placeholder="Nhập mã Sinh viên cần ủy quyền..." class="h-11 flex-1 rounded-xl border border-amber-200 bg-white px-4 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500" />
          <button @click="delegateAccess" class="h-11 rounded-xl bg-amber-600 px-6 font-bold text-white transition hover:bg-amber-700">Phân quyền</button>
          <button @click="revokeAccess" class="h-11 rounded-xl border border-amber-600 bg-white px-6 font-bold text-amber-700 transition hover:bg-amber-50">Thu hồi</button>
        </div>
      </section>

    </div>

    <!-- MODAL CHI TIẾT TỦ & THAO TÁC (Tích hợp hình ảnh thiết bị + form OTP) -->
    <div v-if="selectedCabinet" class="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 p-5 backdrop-blur-sm" @click.self="selectedCabinet = null">
      <div class="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div class="bg-brand p-5 text-white">
          <h2 class="text-xl font-bold">Tủ thiết bị - {{ selectedCabinet.name }}</h2>
          <p class="text-sm text-blue-100">Trạng thái: Đang mượn</p>
        </div>
        
        <div class="p-6">
          <!-- Hiển thị thiết bị có trong ngăn tủ -->
          <p class="mb-3 text-sm font-bold uppercase tracking-wide text-slate-400">Thiết bị bên trong</p>
          <div class="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <!-- Dùng dữ liệu mock tạm, sau này map từ DB -->
            <div class="flex flex-col items-center gap-2 rounded-xl border border-blue-50 bg-slate-50 p-3">
              <div class="flex size-10 items-center justify-center rounded-lg bg-white text-xl shadow-sm">📽️</div>
              <span class="text-xs font-semibold text-ink">Máy chiếu</span>
            </div>
            <div class="flex flex-col items-center gap-2 rounded-xl border border-blue-50 bg-slate-50 p-3">
              <div class="flex size-10 items-center justify-center rounded-lg bg-white text-xl shadow-sm">🖱️</div>
              <span class="text-xs font-semibold text-ink">Chuột Laser</span>
            </div>
          </div>

          <!-- Cụm thao tác mở tủ -->
          <p class="mb-3 text-sm font-bold uppercase tracking-wide text-slate-400">Thao tác mở tủ</p>
          <div class="flex gap-2">
            <input v-model="otpValue" type="text" placeholder="Nhập OTP trên màn hình tủ" maxlength="6" class="h-12 flex-1 rounded-xl border border-blue-200 bg-mist px-4 text-center text-lg font-bold tracking-widest text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand" />
            <button @click="resendOtp" class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-white text-slate-500 hover:bg-blue-50 hover:text-brand" title="Gửi lại OTP">
              <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
            <button @click="openDoor" class="flex h-12 items-center gap-2 rounded-xl bg-ink px-6 font-bold text-white transition hover:bg-slate-800">
              <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
              Mở Khóa
            </button>
          </div>

          <!-- Nút trả đồ dự phòng (Đợi tích hợp AI/RFID) -->
          <div class="mt-6 border-t border-dashed border-blue-100 pt-6">
            <button class="h-12 w-full rounded-xl border-2 border-brand bg-white font-bold text-brand transition hover:bg-brand hover:text-white">
              Cất đồ & Hoàn tất trả thiết bị
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- BOTTOM MENU KẾ THỪA[cite: 3] -->
    <!-- ... (Giữ nguyên menu bottom mobile) ... -->
    
  </main>
</template>
<script setup>
import AdminLayout from '@/components/admin/layout/AdminLayout.vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as signalR from '@microsoft/signalr' // <-- THÊM IMPORT NÀY

const url = import.meta.env.VITE_API_URL || 'http://localhost:5146/api'
const hubUrl = url.replace('/api', '')

const search = ref('')
const statusFilter = ref('Trạng thái tủ')
const doorFilter = ref('Tình trạng cửa')
const networkFilter = ref('Tình trạng mạng')
const isLoading = ref(false)
const cabinets = ref([])

let hubConnection = null

// Hàm lấy dữ liệu ban đầu
async function fetchCabinets() {
  isLoading.value = true
  const token = sessionStorage.getItem('classhub-token')
  try {
    const res = await fetch(`${url}/admin/cabinets`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    if (res.ok) cabinets.value = await res.json()
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

// KHỞI TẠO KẾT NỐI REALTIME SIGNALR
onMounted(async () => {
  await fetchCabinets()

  hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(`${hubUrl}/hub/cabinet`)
    .withAutomaticReconnect()
    .build()

  // Khi có bất kỳ tủ nào gửi trạng thái từ ESP32 hoặc từ Admin
  hubConnection.on('CabinetStatusChanged', (data) => {
    console.log('[Realtime SignalR] Tủ thay đổi trạng thái:', data)

    const target = cabinets.value.find(c => c.roomId === data.roomId || c.id === data.roomId)
    if (target) {
      target.doorCondition = data.doorCondition // "Đóng" hoặc "Mở"
      target.isDoorOpen = data.isOpen
      target.isOnline = data.isOnline
      
      // Nếu mở cửa thì chuyển trạng thái sang Đang mượn (nếu trước đó đang trống)
      if (data.isOpen && target.status === 'Trống') {
        target.status = 'Đang mượn'
      }
    }
  })

  try {
    await hubConnection.start()
    console.log('Đã kết nối Realtime Hub Tủ đồ!')
  } catch (err) {
    console.error('Kết nối Realtime thất bại:', err)
  }
})

// Hủy kết nối khi chuyển trang để giải phóng tài nguyên
onUnmounted(() => {
  if (hubConnection) hubConnection.stop()
})

// Mở khóa khẩn cấp từ xa
async function handleRemoteOpen(cab) {
  if (!confirm(`Bạn có chắc chắn muốn gửi lệnh MỞ KHÓA TỪ XA cho ${cab.name}?`)) return

  const token = sessionStorage.getItem('classhub-token')
  try {
    const res = await fetch(`${url}/admin/cabinets/remote-open/${cab.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await res.json()
    if (res.ok) {
      alert(data.message || 'Mở tủ thành công!')
      fetchCabinets()
    } else {
      alert(data.message || 'Không thể mở tủ!')
    }
  } catch (err) {
    alert('Lỗi kết nối máy chủ!')
  }
}

// Khóa tủ từ xa
async function handleRemoteLock(cab) {
  const token = sessionStorage.getItem('classhub-token')
  try {
    const res = await fetch(`${url}/admin/cabinets/remote-lock/${cab.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (res.ok) {
      fetchCabinets()
    }
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  fetchCabinets()
})

// Bộ lọc tìm kiếm & trạng thái
const filteredCabinets = computed(() => {
  return cabinets.value.filter(c => {
    const matchStatus = statusFilter.value === 'Trạng thái tủ' || c.status === statusFilter.value
    const matchDoor = doorFilter.value === 'Tình trạng cửa' || c.doorCondition === doorFilter.value
    const matchNetwork = networkFilter.value === 'Tình trạng mạng'
      || (networkFilter.value === 'Online' && c.isOnline)
      || (networkFilter.value === 'Offline' && !c.isOnline)
    const keyword = search.value.toLowerCase().trim()
    const matchSearch = !keyword
      || c.name.toLowerCase().includes(keyword)
      || c.building.toLowerCase().includes(keyword)
      || c.floor.toLowerCase().includes(keyword)
      || c.borrower.toLowerCase().includes(keyword)
      || c.roomId.toLowerCase().includes(keyword)

    return matchStatus && matchDoor && matchNetwork && matchSearch
  })
})
</script>

<template>
  <AdminLayout>
    <div class="w-full">
      <!-- Header NEO CỐ ĐỊNH -->
      <div
        class="sticky top-0 z-40 bg-mist/95 backdrop-blur-sm border-b border-slate-200/60 shadow-sm px-4 sm:px-6 lg:px-32 pt-6 pb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Quản lý phần cứng</p>
          <h1 class="mt-0.5 text-2xl font-black text-ink">Tủ đồ thiết bị thông minh</h1>
        </div>
        <div class="flex items-center gap-3">
          <button @click="fetchCabinets" :disabled="isLoading"
            class="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 h-10 text-xs font-bold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            <span :class="{ 'animate-spin': isLoading }"></span>
            <span><font-awesome-icon icon="fa-solid fa-arrows-rotate" class="size-4 text-slate-500" /> Làm mới</span>
          </button>
        </div>
      </div>

      <!-- Nội dung Body -->
      <div class="px-4 sm:px-6 lg:px-32 pt-5 pb-10">

        <!-- Filter bar -->
        <div class="mb-5 flex flex-col sm:flex-row gap-3">
          <input v-model="search" type="text" placeholder="Tìm theo tên tủ, phòng, tòa nhà, người mượn..."
            class="h-11 flex-1 rounded-xl border border-blue-100 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-brand shadow-sm" />

          <!-- Lọc Trạng thái mượn -->
          <select v-model="statusFilter"
            class="h-11 rounded-xl border border-blue-100 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-brand sm:w-44 shadow-sm">
            <option>Trạng thái tủ</option>
            <option>Trống</option>
            <option>Đang mượn</option>
            <option>Bảo trì</option>
          </select>

          <select v-model="networkFilter"
            class="h-11 rounded-xl border border-blue-100 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-brand sm:w-44 shadow-sm">
            <option>Tình trạng mạng</option>
            <option>Online</option>
            <option>Offline</option>
          </select>

          <!-- Lọc Tình trạng Cửa tủ (MỚI) -->
          <select v-model="doorFilter"
            class="h-11 rounded-xl border border-blue-100 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-brand sm:w-44 shadow-sm">
            <option>Tình trạng cửa</option>
            <option>Đóng</option>
            <option>Mở</option>
          </select>
        </div>

        <!-- Table Danh sách Tủ -->
        <div class="rounded-2xl border border-blue-100 bg-white shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-blue-50 bg-blue-50/60">
                  <th
                    class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                    Tên tủ</th>
                  <th
                    class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                    Vị trí</th>
                  <th
                    class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                    Mạng</th>
                  <th
                    class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                    Trạng thái</th>
                  <th
                    class="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                    Tình trạng</th>
                  <th
                    class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                    Người đang mượn</th>
                  <th
                    class="px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                    Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cab in filteredCabinets" :key="cab.id"
                  class="border-b border-blue-50 transition hover:bg-blue-50/30">

                  <!-- Tên tủ -->
                  <td class="px-5 py-4 font-bold text-ink whitespace-nowrap">
                    <div class="flex items-center gap-2">
                      <span class="size-2 rounded-full"
                        :class="cab.isOnline ? 'bg-emerald-500' : 'bg-slate-300'"></span>
                      <div>
                        <p class="font-bold text-slate-900">{{ cab.name }}</p>
                        <p class="text-[11px] text-slate-400 font-normal">Topic: {{ cab.mqttTopic }}</p>
                      </div>
                    </div>
                  </td>

                  <!-- Vị trí -->
                  <td class="px-5 py-4 font-medium text-slate-600 whitespace-nowrap">
                    <span class="font-semibold text-slate-800">{{ cab.building }}</span> • {{ cab.floor }}
                  </td>

                  <!-- Mạng -->
                  <td class="px-5 py-4 whitespace-nowrap">
                    <span
                      :class="cab.isOnline ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'"
                      class="rounded-md border px-2 py-0.5 text-[12px] font-bold">
                      {{ cab.isOnline ? 'Online' : 'Offline' }}
                    </span>
                  </td>

                  <!-- Trạng thái mượn -->
                  <td class="px-5 py-4 whitespace-nowrap">
                    <span :class="{
                      'bg-emerald-100 text-emerald-700': cab.status === 'Trống',
                      'bg-amber-100 text-amber-700': cab.status === 'Đang mượn',
                      'bg-red-100 text-red-700': cab.status === 'Bảo trì'
                    }" class="rounded-md px-2.5 py-1 text-xs font-bold">
                      {{ cab.status }}
                    </span>
                  </td>

                  <!-- Trạng thái cửa tủ -->
                  <td class="px-5 py-4 text-center whitespace-nowrap">
                    <span :class="cab.doorCondition === 'Mở'
                      ? 'bg-yellow-100 text-yellow-700 border-yellow-300 animate-pulse'
                      : 'bg-green-100 text-green-700 border-green-300'"
                      class="inline-flex items-center justify-center rounded-lg border px-3 py-1 text-xs font-bold">
                      {{ cab.doorCondition === 'Mở' ? 'Mở' : 'Đóng' }}
                    </span>
                  </td>

                  <!-- Người mượn -->
                  <td class="px-5 py-4 font-medium text-slate-600 whitespace-nowrap">
                    <span :class="cab.borrower !== '---' ? 'text-blue-600 font-semibold' : 'text-slate-400'">
                      {{ cab.borrower }}
                    </span>
                  </td>

                  <!-- Thao tác Admin -->
                  <td class="px-5 py-4 text-center whitespace-nowrap">
                    <div class="flex items-center justify-center gap-2">
                      <button v-if="cab.doorCondition === 'Đóng'" @click="handleRemoteOpen(cab)"
                        class="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-brand hover:bg-brand hover:text-white transition border border-blue-200"
                        title="Mở tủ khẩn cấp từ xa">
                        Mở tủ
                      </button>
                      <button v-else @click="handleRemoteLock(cab)"
                        class="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 hover:bg-amber-600 hover:text-white transition border border-amber-200"
                        title="Khóa chốt tủ">
                        Khóa tủ
                      </button>
                    </div>
                  </td>

                </tr>

                <!-- Khi không có dữ liệu -->
                <tr v-if="filteredCabinets.length === 0">
                  <td colspan="7" class="py-16 text-center text-slate-400">
                    {{ isLoading ? 'Đang tải dữ liệu từ hệ thống...' : 'Không tìm thấy tủ đồ nào phù hợp.' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  </AdminLayout>
</template>
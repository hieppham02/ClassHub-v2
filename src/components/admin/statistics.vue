<script setup>
import AdminLayout from '@/components/admin/layout/AdminLayout.vue'
import { ref, reactive, computed } from 'vue'

const showFilterModal = ref(false)

const activeFilters = reactive({
  groupBy: 'room',
  dateFrom: '',
  dateTo: ''
})

const tempFilters = reactive({
  groupBy: 'room',
  dateFrom: '',
  dateTo: ''
})

const rawData = ref([
  { id: 1, room: 'EAUT-101', slot: 'Ca 1', floor: 'Tầng 1', building: 'Tòa EAUT', user: 'Phạm Hoàng Hiệp', onTime: true },
  { id: 2, room: 'DTD-201', slot: 'Ca 2', floor: 'Tầng 2', building: 'Đinh Trọng Dật', user: 'Nguyễn Văn Đạt', onTime: true },
  { id: 3, room: 'DTD-202', slot: 'Ca 3', floor: 'Tầng 2', building: 'Đinh Trọng Dật', user: 'Kiều Thanh Ngân', onTime: false },
  { id: 4, room: 'EAUT-101', slot: 'Ca 1', floor: 'Tầng 1', building: 'Tòa EAUT', user: 'Trần Văn A', onTime: true },
  { id: 5, room: 'VNB-208', slot: 'Ca 4', floor: 'Tầng 2', building: 'Việt Nam Building', user: 'Phạm Hoàng Hiệp', onTime: true },
  { id: 6, room: 'EAUT-102', slot: 'Ca 2', floor: 'Tầng 1', building: 'Tòa EAUT', user: 'Nguyễn Văn Đạt', onTime: false }
])

const aggregatedData = computed(() => {
  const grouped = {}
  rawData.value.forEach(item => {
    const key = item[activeFilters.groupBy]
    if (!grouped[key]) grouped[key] = { name: key, total: 0, onTime: 0, late: 0 }
    grouped[key].total++
    if (item.onTime) grouped[key].onTime++
    else grouped[key].late++
  })
  return Object.values(grouped).sort((a, b) => b.total - a.total)
})

const groupLabel = computed(() => {
  const labels = { room: 'Tên phòng', floor: 'Tầng', building: 'Tòa nhà', user: 'Người dùng' }
  return labels[activeFilters.groupBy]
})

// Tọa độ biểu đồ đường sóng mượt (Smooth Area Line Chart) chuẩn phong cách UI thẻ phẳng của ảnh mẫu
const lineChartPoints = computed(() => {
  return "M 0,180 Q 150,180 250,150 T 450,80 T 600,140 T 750,180 L 800,180"
})

const lineChartArea = computed(() => {
  return "M 0,180 Q 150,180 250,150 T 450,80 T 600,140 T 750,180 L 800,200 L 0,200 Z"
})

function openFilterModal() {
  Object.assign(tempFilters, activeFilters)
  showFilterModal.value = true
}

function applyFilter() {
  Object.assign(activeFilters, tempFilters)
  showFilterModal.value = false
}
</script>

<template>
  <AdminLayout>
    <!-- Giữ nền trắng thuần túy, bỏ background lưới, giữ font hệ thống Class Hub, áp dụng hoàn toàn layout cấu trúc thẻ thống kê ngang kiểu 9Router -->
    <div class="min-h-screen bg-white text-ink px-6 sm:px-10 lg:px-16 py-8">
      
      <!-- Modal Bộ lọc -->
      <div v-if="showFilterModal" class="fixed inset-0 z-[70] flex items-center justify-center bg-ink/40 p-4 sm:p-5 backdrop-blur-sm" @click.self="showFilterModal = false">
        <div class="w-full max-w-sm rounded-2xl bg-white border border-blue-100 shadow-2xl overflow-hidden flex flex-col">
          <div class="bg-blue-50/60 p-5 text-ink flex justify-between items-center shrink-0 border-b border-blue-50">
            <div><h2 class="text-base font-bold tracking-tight">Bộ lọc thống kê</h2></div>
            <button @click="showFilterModal = false" class="rounded-full bg-blue-100/60 p-2 hover:bg-blue-200/60 transition text-slate-600">
              <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div class="p-5 sm:p-6 flex flex-col gap-5">
            <label class="grid gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Gom nhóm theo
              <select v-model="tempFilters.groupBy" class="h-11 rounded-xl border border-blue-100 bg-white px-4 text-sm text-ink outline-none focus:border-brand focus:ring-1 focus:ring-brand">
                <option value="room">Theo phòng học</option>
                <option value="floor">Theo tầng</option>
                <option value="building">Theo tòa nhà</option>
                <option value="user">Theo người dùng</option>
              </select>
            </label>
            
            <div class="grid grid-cols-2 gap-4">
              <label class="grid gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Từ ngày
                <input v-model="tempFilters.dateFrom" type="date" class="h-11 rounded-xl border border-blue-100 bg-white px-3 text-sm text-ink outline-none focus:border-brand focus:ring-1 focus:ring-brand" />
              </label>
              <label class="grid gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Đến ngày
                <input v-model="tempFilters.dateTo" type="date" class="h-11 rounded-xl border border-blue-100 bg-white px-3 text-sm text-ink outline-none focus:border-brand focus:ring-1 focus:ring-brand" />
              </label>
            </div>
          </div>

          <div class="bg-slate-50 p-4 border-t border-blue-50 flex gap-3">
            <button @click="showFilterModal = false" class="h-10 flex-1 rounded-xl border border-blue-200 text-xs font-bold text-slate-600 hover:bg-white transition">Hủy</button>
            <button @click="applyFilter" class="h-10 flex-1 rounded-xl bg-brand text-xs font-bold text-white shadow-md hover:bg-brand-dark transition">Áp dụng</button>
          </div>
        </div>
      </div>

      <!-- Header -->
      <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-blue-100 pb-6">
        <div>
          <div class="flex items-center gap-2">
            <span class="inline-block size-2 rounded-full bg-brand"></span>
            <p class="text-[11px] font-bold uppercase tracking-widest text-brand">Analytics Dashboard</p>
          </div>
          <h1 class="mt-1 text-2xl sm:text-3xl font-black text-ink tracking-tight">Thống kê lượt mượn trả</h1>
        </div>
        
        <div class="flex items-center gap-4">
          <p class="text-xs font-medium text-slate-500">
            Đang xem theo: <span class="text-brand font-semibold">{{ groupLabel }}</span>
          </p>
          <button @click="openFilterModal" class="flex h-10 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-xs font-bold text-white shadow-md shadow-brand/20 hover:bg-brand-dark transition shrink-0">
            <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Lọc dữ liệu
          </button>
        </div>
      </div>

      <!-- Dashboard Cards (Style các thẻ thông số ngang liền mạch y hệt UI ảnh mẫu) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm flex flex-col justify-between">
          <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tổng lượt mượn</p>
          <p class="text-2xl sm:text-3xl font-black text-ink mt-3 tracking-tight">{{ rawData.length }}</p>
        </div>
        
        <div class="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Đúng hạn</p>
            <p class="text-2xl sm:text-3xl font-black text-emerald-600 mt-3 tracking-tight">{{ rawData.filter(x => x.onTime).length }}</p>
          </div>
        </div>

        <div class="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Trễ hạn</p>
            <p class="text-2xl sm:text-3xl font-black text-red-600 mt-3 tracking-tight">{{ rawData.filter(x => !x.onTime).length }}</p>
          </div>
        </div>

        <div class="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tỷ lệ đúng hạn</p>
            <p class="text-2xl sm:text-3xl font-black text-brand mt-3 tracking-tight">
              {{ Math.round((rawData.filter(x => x.onTime).length / rawData.length) * 100) }}%
            </p>
          </div>
        </div>
      </div>

      <!-- Biểu đồ Đường sóng mượt (Smooth Area Line Chart) chuẩn phong cách trang chủ ảnh mẫu nhưng dùng trọn vẹn tone màu brand của hệ thống -->
      <div class="grid grid-cols-1 gap-6 mb-6">
        <div class="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-2 rounded-xl bg-blue-50/80 p-1 border border-blue-100">
              <button class="rounded-lg bg-brand px-4 py-1.5 text-xs font-bold text-white shadow-sm">Biểu đồ tổng quan</button>
              <button class="rounded-lg px-4 py-1.5 text-xs font-bold text-slate-600 hover:text-brand transition">Chi tiết</button>
            </div>
            <div class="flex gap-2">
              <span class="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-brand border border-blue-100">Real-time Analytics</span>
            </div>
          </div>
          
          <div class="relative w-full h-64">
            <div class="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div class="border-b border-blue-50 w-full text-[10px] text-slate-400 pl-1">6.0M</div>
              <div class="border-b border-blue-50 w-full text-[10px] text-slate-400 pl-1">4.5M</div>
              <div class="border-b border-blue-50 w-full text-[10px] text-slate-400 pl-1">3.0M</div>
              <div class="border-b border-blue-50 w-full text-[10px] text-slate-400 pl-1">1.5M</div>
              <div class="border-b border-blue-50 w-full text-[10px] text-slate-400 pl-1">0</div>
            </div>

            <svg viewBox="0 0 800 200" preserveAspectRatio="none" class="w-full h-full relative z-10">
              <defs>
                <linearGradient id="systemBrandGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="var(--color-brand, #2563eb)" stop-opacity="0.25" />
                  <stop offset="100%" stop-color="var(--color-brand, #2563eb)" stop-opacity="0.0" />
                </linearGradient>
              </defs>
              <path :d="lineChartArea" fill="url(#systemBrandGradient)" />
              <path :d="lineChartPoints" fill="none" stroke="var(--color-brand, #2563eb)" stroke-width="2.5" stroke-linecap="round" />
            </svg>
          </div>

          <div class="flex justify-between text-[10px] text-slate-400 mt-3 font-mono">
            <span>00:00</span><span>03:00</span><span>06:00</span><span>09:00</span><span>12:00</span><span>15:00</span><span>18:00</span><span>21:00</span><span>23:00</span>
          </div>
        </div>
      </div>

      <!-- Detail table -->
      <div class="rounded-2xl border border-blue-100 bg-white shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-blue-50 bg-blue-50/30">
          <h2 class="text-xs font-bold uppercase tracking-wider text-ink">Bảng chi tiết</h2>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-blue-50 bg-blue-50/60">
                <th class="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">{{ groupLabel }}</th>
                <th class="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Tổng mượn</th>
                <th class="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Đúng hạn</th>
                <th class="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Trễ hạn</th>
                <th class="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Tỷ lệ hoàn thành</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-blue-50">
              <tr v-for="item in aggregatedData" :key="item.name" class="transition hover:bg-blue-50/30">
                <td class="px-6 py-4 font-semibold text-ink">{{ item.name }}</td>
                <td class="px-6 py-4 font-bold text-brand">{{ item.total }}</td>
                <td class="px-6 py-4 font-medium text-emerald-600">{{ item.onTime }}</td>
                <td class="px-6 py-4 font-medium text-red-500">{{ item.late }}</td>
                <td class="px-6 py-4 font-bold text-slate-700">
                  {{ Math.round((item.onTime / item.total) * 100) }}%
                </td>
              </tr>
              <tr v-if="aggregatedData.length === 0">
                <td colspan="5" class="py-16 text-center text-slate-400 font-medium text-xs">Không có dữ liệu trong khoảng thời gian này.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>
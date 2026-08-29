<script setup>
import AdminLayout from '@/components/admin/layout/AdminLayout.vue'
import { ref, computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const activeTimeFilter = ref('Today')

const statsData = {
  'Today': { totalBorrows: 42, totalCabinets: 124, activeBorrows: 15, todayBorrows: 42, maintenance: 3 },
  '24h': { totalBorrows: 58, totalCabinets: 124, activeBorrows: 18, todayBorrows: 58, maintenance: 3 },
  '7D': { totalBorrows: 215, totalCabinets: 124, activeBorrows: 22, todayBorrows: 42, maintenance: 3 },
  '30D': { totalBorrows: 890, totalCabinets: 124, activeBorrows: 30, todayBorrows: 42, maintenance: 4 },
  '60D': { totalBorrows: 1650, totalCabinets: 124, activeBorrows: 25, todayBorrows: 42, maintenance: 4 }
}

const stats = computed(() => statsData[activeTimeFilter.value])

const chartSeriesData = {
  'Today': [5, 12, 8, 15, 10, 6],
  '24h': [8, 15, 12, 18, 14, 9],
  '7D': [25, 42, 35, 60, 48, 30],
  '30D': [120, 180, 150, 240, 210, 130],
  '60D': [250, 380, 320, 500, 450, 290]
}

const chartOptions = computed(() => ({
  chart: { type: 'area', toolbar: { show: false }, zoom: { enabled: false }, fontFamily: 'inherit' },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 2.5 },
  colors: ['#2563eb'],
  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.0, stops: [0, 90, 100] } },
  xaxis: {
    categories: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
    labels: { style: { colors: '#64748b', fontSize: '11px', fontWeight: 600 } },
    axisBorder: { show: false }, axisTicks: { show: false }
  },
  yaxis: {
    title: { text: 'Số lượt mượn', style: { color: '#64748b', fontSize: '11px', fontWeight: 600 } },
    labels: { style: { colors: '#64748b', fontSize: '11px' } }
  },
  grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
  tooltip: { theme: 'light', y: { formatter: (val) => `${val} lượt mượn` } }
}))

const chartSeries = computed(() => [{ name: 'Lượt mượn', data: chartSeriesData[activeTimeFilter.value] }])

const donutOptions = computed(() => ({
  chart: { type: 'donut', fontFamily: 'inherit' },
  labels: ['Sẵn sàng (Trống)', 'Đang mượn', 'Bảo trì'],
  colors: ['#10b981', '#f59e0b', '#ef4444'],
  legend: { position: 'bottom', fontSize: '11px', fontWeight: 600 },
  dataLabels: { enabled: true },
  plotOptions: { pie: { donut: { size: '65%' } } },
  tooltip: {
    theme: 'light',
    y: {
      formatter: (val) => `${val} tủ (${Math.round((val / stats.value.totalCabinets) * 100)}%)`
    }
  }
}))

const donutSeries = computed(() => {
  const total = stats.value.totalCabinets
  const borrowing = stats.value.activeBorrows
  const maintenance = stats.value.maintenance
  const available = Math.max(0, total - borrowing - maintenance)
  return [available, borrowing, maintenance]
})

const recentActivities = ref([
  { id: 1, action: 'Mượn thiết bị', user: 'Nguyễn Văn Đạt (20231047)', room: 'DTD201', time: '10 phút trước', color: 'text-amber-600', bg: 'bg-amber-100' },
  { id: 2, action: 'Trả thiết bị', user: 'Phạm Hoàng Hiệp (20231206)', room: 'EAUT101', time: '25 phút trước', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { id: 3, action: 'Ủy quyền trả', user: 'Kiều Thanh Ngân (20231000)', room: 'VNB208', time: '1 giờ trước', color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 4, action: 'Bảo trì tủ', user: 'Admin Hệ Thống', room: 'TT108', time: '2 giờ trước', color: 'text-red-600', bg: 'bg-red-100' },
  { id: 5, action: 'Mượn thiết bị', user: 'Trần Văn A', room: 'DTD202', time: '3 giờ trước', color: 'text-amber-600', bg: 'bg-amber-100' }
])

const topBorrowers = ref([
  { rank: 1, name: 'Phạm Hoàng Hiệp', id: '20231206', total: 34, avatarBg: 'bg-amber-500 text-white' },
  { rank: 2, name: 'Nguyễn Văn Đạt', id: '20231047', total: 28, avatarBg: 'bg-slate-200 text-slate-700' },
  { rank: 3, name: 'Kiều Thanh Ngân', id: '20231000', total: 22, avatarBg: 'bg-amber-700/20 text-amber-800' },
  { rank: 4, name: 'Trần Văn A', id: '20231102', total: 15, avatarBg: 'bg-slate-100 text-slate-600' },
  { rank: 5, name: 'Lê Thị B', id: '20231155', total: 11, avatarBg: 'bg-slate-100 text-slate-600' }
])
</script>

<template>
  <AdminLayout>
    <div class="w-full">
      
      <!-- Header tăng padding 2 bên (px-8 sm:px-10 lg:px-16) -->
      <div class="sticky top-0 z-40 bg-mist/95 backdrop-blur-sm border-b border-slate-200/60 shadow-sm px-8 sm:px-10 lg:px-32 pt-6 pb-4">
        <p class="text-[11px] font-bold uppercase tracking-widest text-slate-400">Class Hub Admin</p>
        <h1 class="mt-0.5 text-2xl font-black text-ink">Tổng quan hệ thống</h1>
      </div>

      <!-- Nội dung chính tăng padding tương ứng -->
      <div class="px-8 sm:px-10 lg:px-32 pt-5 pb-10">
        
        <div class="flex justify-end mb-4">
          <!-- Thu nhỏ khối Filter: p-0.5, rounded-lg -->
          <div class="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 shadow-sm">
            <button 
              v-for="filterOpt in ['Today', '24h', '7D', '30D', '60D']" 
              :key="filterOpt"
              @click="activeTimeFilter = filterOpt"
              :class="activeTimeFilter === filterOpt ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'"
              class="rounded-md px-2.5 py-1 text-[11px] transition"
            >
              {{ filterOpt }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
            <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tổng số lượt mượn</p>
            <p class="text-2xl sm:text-3xl font-bold text-slate-900 mt-3 tracking-tight">{{ stats.totalBorrows }}</p>
            <p class="mt-1 text-[11px] text-slate-400">Lượt mượn trong {{ activeTimeFilter }}</p>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
            <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tổng số tủ</p>
            <p class="text-2xl sm:text-3xl font-bold text-slate-900 mt-3 tracking-tight">{{ stats.totalCabinets }}</p>
            <p class="mt-1 text-[11px] text-slate-400">Thiết bị trên hệ thống</p>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
            <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Đang mượn</p>
            <p class="text-2xl sm:text-3xl font-bold text-amber-600 mt-3 tracking-tight">{{ stats.activeBorrows }}</p>
            <p class="mt-1 text-[11px] text-slate-400">Lượt mượn đang active</p>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
            <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Hôm nay</p>
            <p class="text-2xl sm:text-3xl font-bold text-emerald-600 mt-3 tracking-tight">{{ stats.todayBorrows }}</p>
            <p class="mt-1 text-[11px] text-slate-400">Lượt mượn trong ngày</p>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
            <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Bảo trì</p>
            <p class="text-2xl sm:text-3xl font-bold text-red-600 mt-3 tracking-tight">{{ stats.maintenance }}</p>
            <p class="mt-1 text-[11px] text-slate-400">Tủ đang sửa chữa</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div class="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-sm font-bold uppercase tracking-wider text-slate-700">Biểu đồ xu hướng lượt mượn theo tuần</h2>
                <span class="text-xs font-medium text-slate-400">Khoảng thời gian: <strong class="text-slate-700">{{ activeTimeFilter }}</strong></span>
              </div>
              <div class="mt-2">
                <vue-apex-charts type="area" height="240" :options="chartOptions" :series="chartSeries" />
              </div>
            </div>
            <div class="mt-4 flex items-center justify-between text-xs text-slate-400 px-2 border-t border-slate-100 pt-3">
              <span>Dữ liệu hiển thị từ Thứ 2 đến Thứ 7</span>
              <span>Hệ thống quản lý Class Hub</span>
            </div>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-sm font-bold uppercase tracking-wider text-slate-700">Trạng thái tủ đồ</h2>
              <span class="text-xs font-semibold text-slate-400">Tổng: {{ stats.totalCabinets }} tủ</span>
            </div>
            <div class="flex items-center justify-center my-auto">
              <vue-apex-charts type="donut" width="100%" height="220" :options="donutOptions" :series="donutSeries" />
            </div>
            <p class="text-[11px] text-center text-slate-400 mt-2">Tỷ lệ tủ sẵn sàng, đang mượn và bảo trì</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col h-[340px]">
            <h2 class="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4 shrink-0">Xếp hạng lượt mượn của người dùng</h2>
            <div class="flex-1 overflow-y-auto pr-2 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-slate-200">
              <div 
                v-for="user in topBorrowers" 
                :key="user.id"
                class="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0"
              >
                <div class="flex items-center gap-3">
                  <span :class="['flex size-7 items-center justify-center rounded-full text-xs font-bold', user.avatarBg]">
                    {{ user.rank }}
                  </span>
                  <div>
                    <p class="text-xs font-semibold text-slate-800">{{ user.name }}</p>
                    <p class="text-[10px] text-slate-400">Mã NV/SV: {{ user.id }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-xs font-bold text-brand bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                    {{ user.total }} lượt
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col h-[340px]">
            <h2 class="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4 shrink-0">Hoạt động gần đây</h2>
            <div class="flex-1 overflow-y-auto pr-2 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-slate-200">
              <div 
                v-for="activity in recentActivities" 
                :key="activity.id"
                class="flex items-start gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0"
              >
                <div :class="[activity.bg, activity.color]" class="flex size-9 shrink-0 items-center justify-center rounded-full">
                  <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold text-slate-800">
                    {{ activity.user }} <span class="font-normal text-slate-400">vừa thực hiện</span> {{ activity.action }}
                  </p>
                  <div class="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                    <span class="font-bold text-brand">Tủ {{ activity.room }}</span>
                    <span>•</span>
                    <span>{{ activity.time }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
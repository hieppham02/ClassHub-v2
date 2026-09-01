<script setup>
import AdminLayout from '@/components/admin/layout/AdminLayout.vue'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import * as signalR from '@microsoft/signalr'

const url = import.meta.env.VITE_API_URL || 'http://localhost:5146/api'
const hubUrl = url.replace('/api', '')

const activeTimeFilter = ref('Today')
const isLoading = ref(false)

// State dữ liệu thống kê từ API
const stats = ref({
  totalBorrows: 0,
  totalCabinets: 0,
  activeBorrows: 0,
  todayBorrows: 0,
  maintenance: 0
})

const chartData = ref([0, 0, 0, 0, 0, 0])
const chartCategories = ref(['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'])
const topBorrowers = ref([])
const recentActivities = ref([])

let hubConnection = null

// Hàm gọi API lấy dữ liệu tổng quan
async function fetchDashboardData() {
  isLoading.value = true
  const token = sessionStorage.getItem('classhub-token')
  const headers = { 
    'Content-Type': 'application/json', 
    'Authorization': `Bearer ${token}` 
  }

  try {
    const [resOverview, resTop, resAct] = await Promise.all([
      fetch(`${url}/admin/statistics/overview?timeFilter=${activeTimeFilter.value}`, { headers }),
      fetch(`${url}/admin/statistics/top-borrowers`, { headers }),
      fetch(`${url}/admin/statistics/recent-activities`, { headers })
    ])

    if (resOverview.ok) {
      const data = await resOverview.json()
      stats.value = data.stats
      chartData.value = data.chartSeries
      if (data.chartCategories && data.chartCategories.length > 0) {
        chartCategories.value = data.chartCategories
      }
    }
    if (resTop.ok) topBorrowers.value = await resTop.json()
    if (resAct.ok) recentActivities.value = await resAct.json()
  } catch (err) {
    console.error('Lỗi khi tải dữ liệu dashboard:', err)
  } finally {
    isLoading.value = false
  }
}

// Tự động gọi lại API khi đổi bộ lọc thời gian
watch(activeTimeFilter, () => fetchDashboardData())

// KHỞI TẠO REALTIME SIGNALR
onMounted(async () => {
  await fetchDashboardData()

  hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(`${hubUrl}/hub/cabinet`)
    .withAutomaticReconnect()
    .build()

  // Bất kỳ sự kiện nào xảy ra ở tủ IoT -> Tự động load lại số liệu Realtime
  hubConnection.on('CabinetStatusChanged', (data) => {
    console.log('⚡ [Dashboard Realtime Sync]:', data)
    fetchDashboardData()
  })

  try {
    await hubConnection.start()
    console.log('Dashboard đã kết nối Realtime SignalR thành công!')
  } catch (err) {
    console.error('Kết nối Realtime SignalR thất bại:', err)
  }
})

onUnmounted(() => {
  if (hubConnection) hubConnection.stop()
})

// Cấu hình Biểu đồ Area Chart
const chartOptions = computed(() => ({
  chart: { type: 'area', toolbar: { show: false }, zoom: { enabled: false }, fontFamily: 'inherit' },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 2.5 },
  colors: ['#2563eb'],
  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.0, stops: [0, 90, 100] } },
  xaxis: {
    categories: chartCategories.value,
    labels: { style: { colors: '#64748b', fontSize: '11px', fontWeight: 600 } },
    axisBorder: { show: false }, 
    axisTicks: { show: false }
  },
  yaxis: {
    title: { text: 'Số lượt mượn', style: { color: '#64748b', fontSize: '11px', fontWeight: 600 } },
    labels: { style: { colors: '#64748b', fontSize: '11px' } }
  },
  grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
  tooltip: { theme: 'light', y: { formatter: (val) => `${val} lượt mượn` } }
}))

const chartSeries = computed(() => [{ name: 'Lượt mượn', data: chartData.value }])

// Cấu hình Biểu đồ Donut Chart (Trạng thái tủ)
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
      formatter: (val) => `${val} tủ (${stats.value.totalCabinets > 0 ? Math.round((val / stats.value.totalCabinets) * 100) : 0}%)`
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
</script>

<template>
  <AdminLayout>
    <div class="w-full">
      
      <!-- Header -->
      <div class="sticky top-0 z-40 bg-mist/95 backdrop-blur-sm border-b border-slate-200/60 shadow-sm px-8 sm:px-10 lg:px-32 pt-6 pb-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-widest text-slate-400">Class Hub Admin</p>
            <h1 class="mt-0.5 text-2xl font-black text-ink">Tổng quan hệ thống</h1>
          </div>
          <button 
            @click="fetchDashboardData" 
            :disabled="isLoading"
            class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition shadow-sm disabled:opacity-60"
          >
            <font-awesome-icon 
              icon="fa-solid fa-arrows-rotate" 
              :class="{ 'animate-spin': isLoading }"
              class="size-3.5 text-slate-500" 
            />
            <span>{{ isLoading ? 'Đang tải...' : 'Làm mới' }}</span>
          </button>
        </div>
      </div>

      <!-- Nội dung chính -->
      <div class="px-8 sm:px-10 lg:px-32 pt-5 pb-10">
        
        <!-- Filter thời gian -->
        <div class="flex justify-end mb-4">
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

        <!-- 5 Thẻ Số Liệu Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
            <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tổng số lượt mượn</p>
            <p class="text-2xl sm:text-3xl font-bold text-slate-900 mt-3 tracking-tight">{{ stats.totalBorrows }}</p>
            <p class="mt-1 text-[11px] text-slate-400">Lượt mượn trong {{ activeTimeFilter }}</p>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
            <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tổng số tủ / phòng</p>
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
            <p class="mt-1 text-[11px] text-slate-400">Phòng/tủ đang bảo trì</p>
          </div>
        </div>

        <!-- 2 Biểu đồ ApexCharts -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          <!-- Area Chart -->
          <div class="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-sm font-bold uppercase tracking-wider text-slate-700">Biểu đồ xu hướng lượt mượn trong tuần</h2>
                <span class="text-xs font-medium text-slate-400">Bộ lọc: <strong class="text-slate-700">{{ activeTimeFilter }}</strong></span>
              </div>
              <div class="mt-2">
                <vue-apex-charts type="area" height="240" :options="chartOptions" :series="chartSeries" />
              </div>
            </div>
            <div class="mt-4 flex items-center justify-between text-xs text-slate-400 px-2 border-t border-slate-100 pt-3">
              <span>Dữ liệu thực tế từ Thứ 2 đến Thứ 7</span>
              <span>Hệ thống ClassHub EAUT</span>
            </div>
          </div>

          <!-- Donut Chart -->
          <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-sm font-bold uppercase tracking-wider text-slate-700">Trạng thái tủ đồ</h2>
              <span class="text-xs font-semibold text-slate-400">Tổng: {{ stats.totalCabinets }}</span>
            </div>
            <div class="flex items-center justify-center my-auto">
              <vue-apex-charts type="donut" width="100%" height="220" :options="donutOptions" :series="donutSeries" />
            </div>
            <p class="text-[11px] text-center text-slate-400 mt-2">Tỷ lệ tủ sẵn sàng, đang mượn và bảo trì</p>
          </div>
        </div>

        <!-- Bảng xếp hạng & Hoạt động gần đây -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <!-- Top Borrowers -->
          <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col h-[360px]">
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
                    <p class="text-[10px] text-slate-400">Mã SV/GV: {{ user.id }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                    {{ user.total }} lượt
                  </span>
                </div>
              </div>
              <div v-if="topBorrowers.length === 0" class="text-center text-xs text-slate-400 py-8">
                Chưa có dữ liệu người dùng mượn
              </div>
            </div>
          </div>

          <!-- Recent Activities -->
          <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col h-[360px]">
            <h2 class="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4 shrink-0">Hoạt động gần đây</h2>
            <div class="flex-1 overflow-y-auto pr-2 flex flex-col gap-3.5 scrollbar-thin scrollbar-thumb-slate-200">
              <div 
                v-for="activity in recentActivities" 
                :key="activity.id"
                class="flex items-start gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0"
              >
                <div :class="[activity.bg, activity.color]" class="flex size-8 shrink-0 items-center justify-center rounded-full">
                  <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold text-slate-800 leading-snug">
                    {{ activity.user }} <span class="font-normal text-slate-500">thực hiện</span> <span class="font-bold text-slate-700">{{ activity.action }}</span>
                  </p>
                  
                  <!-- Metadata Pill Badges (Details, Time, IP, User-Agent) -->
                  <div class="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                    <span class="text-slate-600 font-medium">{{ activity.details }}</span>
                    <span>•</span>
                    <span class="text-slate-400">{{ activity.time }}</span>
                    
                    <!-- IP Badge -->
                    <span 
                      v-if="activity.ip_address" 
                      class="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-600 border border-slate-200/60"
                    >
                      IP: {{ activity.ip_address }}
                    </span>

                    <!-- User-Agent (OS) Badge -->
                    <span 
                      v-if="activity.user_agent" 
                      class="inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 border border-blue-100"
                    >
                      UA: {{ activity.user_agent }}
                    </span>
                  </div>
                </div>
              </div>

              <div v-if="recentActivities.length === 0" class="text-center text-xs text-slate-400 py-8">
                Chưa có nhật ký hoạt động nào
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </AdminLayout>
</template>
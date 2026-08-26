<script setup>
import AdminLayout from '@/components/admin/layout/AdminLayout.vue'
import { ref } from 'vue'

const groupBy = ref('room')
const dateFrom = ref('')
const dateTo = ref('')
</script>

<template>
  <AdminLayout>
    <!-- Header -->
    <div class="mb-6">
      <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Báo cáo</p>
      <h1 class="mt-1 text-2xl sm:text-3xl font-black text-ink">Thống kê lượt mượn trả</h1>
    </div>

    <!-- Filter bar -->
    <div class="mb-6 flex flex-col sm:flex-row gap-3">
      <select v-model="groupBy" class="h-11 rounded-xl border border-blue-100 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-brand sm:w-48">
        <option value="room">Theo phòng</option>
        <option value="floor">Theo tầng</option>
        <option value="building">Theo tòa nhà</option>
        <option value="user">Theo người dùng</option>
      </select>
      <label class="flex items-center gap-2 text-sm font-semibold text-slate-500">
        Từ
        <input v-model="dateFrom" type="date" class="h-11 rounded-xl border border-blue-100 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-brand" />
      </label>
      <label class="flex items-center gap-2 text-sm font-semibold text-slate-500">
        Đến
        <input v-model="dateTo" type="date" class="h-11 rounded-xl border border-blue-100 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-brand" />
      </label>
      <button class="h-11 rounded-xl bg-brand px-6 text-sm font-bold text-white shadow-md shadow-brand/20 hover:bg-brand-dark transition sm:ml-auto">
        Lọc dữ liệu
      </button>
    </div>

    <!-- Chart placeholder cards -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
      <div class="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
        <p class="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Tổng lượt mượn</p>
        <div class="flex items-end justify-center h-32 rounded-xl bg-blue-50 text-slate-300">
          <p class="text-sm font-semibold mb-4">Biểu đồ cột</p>
        </div>
      </div>
      <div class="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
        <p class="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Tỉ lệ trả đúng hạn</p>
        <div class="flex items-end justify-center h-32 rounded-xl bg-blue-50 text-slate-300">
          <p class="text-sm font-semibold mb-4">Biểu đồ tròn</p>
        </div>
      </div>
      <div class="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
        <p class="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Top người dùng nhiều nhất</p>
        <div class="flex items-end justify-center h-32 rounded-xl bg-blue-50 text-slate-300">
          <p class="text-sm font-semibold mb-4">Biểu đồ ngang</p>
        </div>
      </div>
    </div>

    <!-- Detail table placeholder -->
    <div class="rounded-2xl border border-blue-100 bg-white shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-blue-50">
        <h2 class="text-sm font-bold text-ink">Chi tiết theo
          <span class="text-brand">{{ { room: 'phòng', floor: 'tầng', building: 'tòa nhà', user: 'người dùng' }[groupBy] }}</span>
        </h2>
      </div>
      <div class="py-16 flex flex-col items-center text-slate-300">
        <svg class="size-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p class="text-sm font-semibold text-slate-400">Chưa có dữ liệu</p>
        <p class="text-xs text-slate-300 mt-1">Kết nối API để hiển thị thống kê</p>
      </div>
    </div>
  </AdminLayout>
</template>


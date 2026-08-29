<script setup>
import AdminLayout from '@/components/admin/layout/AdminLayout.vue'
import { ref } from 'vue'

// Mock data: Thống kê tổng quan
const stats = ref({
  totalCabinets: 124,
  activeBorrows: 15,
  todayBorrows: 42,
  maintenance: 3
})

// Mock data: Hoạt động gần đây
const recentActivities = ref([
  { 
    id: 1, 
    action: 'Mượn thiết bị', 
    user: 'Nguyễn Văn Đạt (20231047)', 
    room: 'DTD201', 
    time: '10 phút trước', 
    icon: 'M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z', 
    color: 'text-amber-600', 
    bg: 'bg-amber-100' 
  },
  { 
    id: 2, 
    action: 'Trả thiết bị', 
    user: 'Phạm Hoàng Hiệp (20231206)', 
    room: 'EAUT101', 
    time: '25 phút trước', 
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', 
    color: 'text-emerald-600', 
    bg: 'bg-emerald-100' 
  },
  { 
    id: 3, 
    action: 'Ủy quyền trả', 
    user: 'Kiều Thanh Ngân (20231000)', 
    room: 'VNB208', 
    time: '1 giờ trước', 
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', 
    color: 'text-blue-600', 
    bg: 'bg-blue-100' 
  },
  { 
    id: 4, 
    action: 'Bảo trì tủ', 
    user: 'Admin Hệ Thống', 
    room: 'TT108', 
    time: '2 giờ trước', 
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', 
    color: 'text-red-600', 
    bg: 'bg-red-100' 
  }
])
</script>

<template>
  <AdminLayout>
    <!-- Page header -->
    <div class="mb-6">
      <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Class Hub Admin</p>
      <h1 class="mt-1 text-2xl sm:text-3xl font-black text-ink">Tổng quan hệ thống</h1>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
      <div class="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
        <p class="text-xs font-bold uppercase tracking-wide text-slate-400">Tổng số tủ</p>
        <p class="mt-2 text-3xl font-black text-ink">{{ stats.totalCabinets }}</p>
        <p class="mt-1 text-xs text-slate-400">Thiết bị trên hệ thống</p>
      </div>
      <div class="rounded-2xl border border-amber-100 bg-amber-50 p-5 shadow-sm">
        <p class="text-xs font-bold uppercase tracking-wide text-amber-600">Đang mượn</p>
        <p class="mt-2 text-3xl font-black text-amber-700">{{ stats.activeBorrows }}</p>
        <p class="mt-1 text-xs text-amber-500">Lượt mượn đang active</p>
      </div>
      <div class="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
        <p class="text-xs font-bold uppercase tracking-wide text-emerald-600">Hôm nay</p>
        <p class="mt-2 text-3xl font-black text-emerald-700">{{ stats.todayBorrows }}</p>
        <p class="mt-1 text-xs text-emerald-500">Lượt mượn trong ngày</p>
      </div>
      <div class="rounded-2xl border border-red-100 bg-red-50 p-5 shadow-sm">
        <p class="text-xs font-bold uppercase tracking-wide text-red-500">Bảo trì</p>
        <p class="mt-2 text-3xl font-black text-red-600">{{ stats.maintenance }}</p>
        <p class="mt-1 text-xs text-red-400">Tủ đang sửa chữa</p>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
      <h2 class="text-base font-bold text-ink mb-5">Hoạt động gần đây</h2>
      
      <div class="flex flex-col gap-4">
        <div 
          v-for="activity in recentActivities" 
          :key="activity.id"
          class="flex items-start gap-4 border-b border-blue-50 pb-4 last:border-0 last:pb-0"
        >
          <!-- Icon -->
          <div :class="[activity.bg, activity.color]" class="flex size-10 shrink-0 items-center justify-center rounded-full">
            <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" :d="activity.icon" />
            </svg>
          </div>
          
          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-ink">
              {{ activity.user }} <span class="font-normal text-slate-500">vừa thực hiện</span> {{ activity.action }}
            </p>
            <div class="mt-1 flex items-center gap-3 text-xs text-slate-400">
              <span class="flex items-center gap-1 font-bold text-brand">
                <svg class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                Tủ {{ activity.room }}
              </span>
              <span>•</span>
              <span>{{ activity.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
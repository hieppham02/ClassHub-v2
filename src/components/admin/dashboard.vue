<script setup>
import AdminLayout from '@/components/admin/layout/AdminLayout.vue'
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
        <p class="mt-2 text-3xl font-black text-ink">—</p>
        <p class="mt-1 text-xs text-slate-400">Chờ kết nối API</p>
      </div>
      <div class="rounded-2xl border border-amber-100 bg-amber-50 p-5 shadow-sm">
        <p class="text-xs font-bold uppercase tracking-wide text-amber-600">Đang mượn</p>
        <p class="mt-2 text-3xl font-black text-amber-700">—</p>
        <p class="mt-1 text-xs text-amber-500">Lượt mượn đang active</p>
      </div>
      <div class="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
        <p class="text-xs font-bold uppercase tracking-wide text-emerald-600">Hôm nay</p>
        <p class="mt-2 text-3xl font-black text-emerald-700">—</p>
        <p class="mt-1 text-xs text-emerald-500">Lượt mượn trong ngày</p>
      </div>
      <div class="rounded-2xl border border-red-100 bg-red-50 p-5 shadow-sm">
        <p class="text-xs font-bold uppercase tracking-wide text-red-500">Bảo trì</p>
        <p class="mt-2 text-3xl font-black text-red-600">—</p>
        <p class="mt-1 text-xs text-red-400">Tủ đang bảo trì</p>
      </div>
    </div>

    <!-- Activity placeholder -->
    <div class="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
      <h2 class="text-base font-bold text-ink mb-4">Hoạt động gần đây</h2>
      <div class="flex flex-col items-center justify-center py-12 text-slate-300">
        <svg class="size-14 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="text-sm font-semibold text-slate-400">Chưa có dữ liệu</p>
        <p class="text-xs text-slate-300 mt-1">Sẽ hiển thị khi kết nối API</p>
      </div>
    </div>
  </AdminLayout>
</template>


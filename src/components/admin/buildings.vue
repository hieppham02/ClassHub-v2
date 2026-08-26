<script setup>
import AdminLayout from '@/components/admin/layout/AdminLayout.vue'
import { ref } from 'vue'

const activeTab = ref('buildings')
</script>

<template>
  <AdminLayout>
    <!-- Header -->
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Quản lý</p>
        <h1 class="mt-1 text-2xl sm:text-3xl font-black text-ink">Tòa nhà &amp; Phòng học</h1>
      </div>
      <button class="h-11 rounded-xl bg-brand px-6 text-sm font-bold text-white shadow-md shadow-brand/20 hover:bg-brand-dark transition shrink-0">
        + Thêm mới
      </button>
    </div>

    <!-- Tabs -->
    <div class="mb-5 flex gap-1 rounded-xl bg-blue-50 p-1 w-fit">
      <button
        @click="activeTab = 'buildings'"
        :class="activeTab === 'buildings' ? 'bg-white text-brand font-bold shadow-sm' : 'text-slate-500 font-medium hover:text-brand'"
        class="rounded-lg px-5 py-2 text-sm transition"
      >
        Tòa nhà
      </button>
      <button
        @click="activeTab = 'rooms'"
        :class="activeTab === 'rooms' ? 'bg-white text-brand font-bold shadow-sm' : 'text-slate-500 font-medium hover:text-brand'"
        class="rounded-lg px-5 py-2 text-sm transition"
      >
        Phòng học
      </button>
    </div>

    <!-- Buildings tab -->
    <div v-if="activeTab === 'buildings'" class="rounded-2xl border border-blue-100 bg-white shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-blue-50 bg-blue-50/60">
              <th class="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Tên tòa</th>
              <th class="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Số tầng</th>
              <th class="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Số phòng</th>
              <th class="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="4" class="py-16 text-center">
                <div class="flex flex-col items-center text-slate-300">
                  <svg class="size-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p class="text-sm font-semibold text-slate-400">Chưa có dữ liệu</p>
                  <p class="text-xs text-slate-300 mt-1">Kết nối API để hiển thị tòa nhà</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Rooms tab -->
    <div v-if="activeTab === 'rooms'" class="rounded-2xl border border-blue-100 bg-white shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-blue-50 bg-blue-50/60">
              <th class="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Tên phòng</th>
              <th class="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Tòa nhà</th>
              <th class="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Tầng</th>
              <th class="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Trạng thái tủ</th>
              <th class="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="5" class="py-16 text-center">
                <div class="flex flex-col items-center text-slate-300">
                  <svg class="size-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                  <p class="text-sm font-semibold text-slate-400">Chưa có dữ liệu</p>
                  <p class="text-xs text-slate-300 mt-1">Kết nối API để hiển thị phòng học</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>


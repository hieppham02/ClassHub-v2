<script setup>
import AdminLayout from '@/components/admin/layout/AdminLayout.vue'
import { ref } from 'vue'

const search = ref('')
const dateFrom = ref('')
const dateTo = ref('')
</script>

<template>
  <AdminLayout>
    <!-- Header -->
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Quản lý</p>
        <h1 class="mt-1 text-2xl sm:text-3xl font-black text-ink">Lịch sử mượn trả</h1>
      </div>
      <button class="h-11 rounded-xl border border-brand px-6 text-sm font-bold text-brand hover:bg-blue-50 transition shrink-0">
        ↓ Xuất CSV
      </button>
    </div>

    <!-- Filter bar -->
    <div class="mb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <input
        v-model="search"
        type="text"
        placeholder="Tìm tên phòng, người mượn, người trả..."
        class="h-11 sm:col-span-2 rounded-xl border border-blue-100 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-brand"
      />
      <label class="grid gap-1 text-xs font-semibold text-slate-500">
        Từ ngày
        <input v-model="dateFrom" type="date" class="h-11 rounded-xl border border-blue-100 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-brand" />
      </label>
      <label class="grid gap-1 text-xs font-semibold text-slate-500">
        Đến ngày
        <input v-model="dateTo" type="date" class="h-11 rounded-xl border border-blue-100 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-brand" />
      </label>
    </div>

    <!-- Table -->
    <div class="rounded-2xl border border-blue-100 bg-white shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-blue-50 bg-blue-50/60">
              <th class="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Tên phòng</th>
              <th class="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Ca học</th>
              <th class="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Ngày mượn</th>
              <th class="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Người mượn</th>
              <th class="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">SĐT mượn</th>
              <th class="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Mượn lúc</th>
              <th class="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Người trả</th>
              <th class="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">SĐT trả</th>
              <th class="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Trả lúc</th>
              <th class="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="10" class="py-16 text-center">
                <div class="flex flex-col items-center text-slate-300">
                  <svg class="size-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="text-sm font-semibold text-slate-400">Chưa có dữ liệu</p>
                  <p class="text-xs text-slate-300 mt-1">Kết nối API để hiển thị lịch sử</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>


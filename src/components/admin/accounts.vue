<script setup>
import AdminLayout from '@/components/admin/layout/AdminLayout.vue'
import { ref } from 'vue'

const search = ref('')
const roleFilter = ref('Tất cả')
</script>

<template>
  <AdminLayout>
    <!-- Header -->
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Quản lý</p>
        <h1 class="mt-1 text-2xl sm:text-3xl font-black text-ink">Tài khoản người dùng</h1>
      </div>
      <button class="h-11 rounded-xl bg-brand px-6 text-sm font-bold text-white shadow-md shadow-brand/20 hover:bg-brand-dark transition shrink-0">
        + Thêm tài khoản
      </button>
    </div>

    <!-- Filter bar -->
    <div class="mb-5 flex flex-col sm:flex-row gap-3">
      <input
        v-model="search"
        type="text"
        placeholder="Tìm theo tên, mã SV/GV, email, SĐT..."
        class="h-11 flex-1 rounded-xl border border-blue-100 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-brand"
      />
      <select v-model="roleFilter" class="h-11 rounded-xl border border-blue-100 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-brand sm:w-44">
        <option>Tất cả</option>
        <option>Sinh viên</option>
        <option>Giảng viên</option>
        <option>Admin</option>
      </select>
    </div>

    <!-- Table -->
    <div class="rounded-2xl border border-blue-100 bg-white shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-blue-50 bg-blue-50/60">
              <th class="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Mã</th>
              <th class="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Họ tên</th>
              <th class="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Vai trò</th>
              <th class="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Lớp / Khoa</th>
              <th class="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Email</th>
              <th class="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">SĐT</th>
              <th class="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="7" class="py-16 text-center">
                <div class="flex flex-col items-center text-slate-300">
                  <svg class="size-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p class="text-sm font-semibold text-slate-400">Chưa có dữ liệu</p>
                  <p class="text-xs text-slate-300 mt-1">Kết nối API để hiển thị danh sách tài khoản</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>


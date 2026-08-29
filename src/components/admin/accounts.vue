<script setup>
import AdminLayout from '@/components/admin/layout/AdminLayout.vue'
import { ref, computed } from 'vue'

const search = ref('')
const roleFilter = ref('Tất cả')

// Mock data: Danh sách tài khoản
const accounts = ref([
  { id: '20231206', name: 'Phạm Hoàng Hiệp', role: 'Admin', class: 'DCCNTT.14.3', email: '20231206@eaut.edu.vn', phone: '0969299262' },
  { id: '20231047', name: 'Nguyễn Văn Đạt', role: 'Sinh viên', class: 'DCCNTT.14.3', email: '20231047@eaut.edu.vn', phone: '0123456789' },
  { id: '20231000', name: 'Kiều Thanh Ngân', role: 'Sinh viên', class: 'DCKT.14.1', email: '20231000@eaut.edu.vn', phone: '0987654321' },
  { id: 'GV001', name: 'Trần Văn A', role: 'Giảng viên', class: 'Khoa CNTT', email: 'tranvana@eaut.edu.vn', phone: '0912345678' },
  { id: '20231111', name: 'Lê Thị B', role: 'Sinh viên', class: 'DCDL.14.2', email: '20231111@eaut.edu.vn', phone: '0933445566' }
])

// Logic tự động lọc dữ liệu dựa trên ô tìm kiếm và dropdown vai trò
const filteredAccounts = computed(() => {
  return accounts.value.filter(acc => {
    // 1. Lọc theo Vai trò
    const matchRole = roleFilter.value === 'Tất cả' || acc.role === roleFilter.value
    
    // 2. Lọc theo Từ khóa (Tên, Mã, Email, SĐT)
    const keyword = search.value.toLowerCase()
    const matchSearch = !keyword || 
                        acc.name.toLowerCase().includes(keyword) || 
                        acc.id.toLowerCase().includes(keyword) || 
                        acc.email.toLowerCase().includes(keyword) || 
                        acc.phone.includes(keyword)
                        
    return matchRole && matchSearch
  })
})
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
            <!-- Render dữ liệu -->
            <tr v-for="acc in filteredAccounts" :key="acc.id" class="border-b border-blue-50 transition hover:bg-blue-50/30">
              <td class="px-5 py-4 font-semibold text-ink">{{ acc.id }}</td>
              <td class="px-5 py-4 font-medium text-ink">{{ acc.name }}</td>
              <td class="px-5 py-4">
                <span :class="{
                  'bg-amber-100 text-amber-700': acc.role === 'Admin',
                  'bg-emerald-100 text-emerald-700': acc.role === 'Giảng viên',
                  'bg-blue-100 text-blue-700': acc.role === 'Sinh viên'
                }" class="rounded-md px-2.5 py-1 text-xs font-bold">
                  {{ acc.role }}
                </span>
              </td>
              <td class="px-5 py-4 text-slate-500">{{ acc.class }}</td>
              <td class="px-5 py-4 text-slate-500">{{ acc.email }}</td>
              <td class="px-5 py-4 text-slate-500">{{ acc.phone }}</td>
              <td class="px-5 py-4">
                <div class="flex gap-3">
                  <button class="font-semibold text-brand hover:text-brand-dark transition">Sửa</button>
                  <button class="font-semibold text-red-500 hover:text-red-700 transition">Khóa</button>
                </div>
              </td>
            </tr>

            <!-- Hiển thị khi không tìm thấy kết quả -->
            <tr v-if="filteredAccounts.length === 0">
              <td colspan="7" class="py-16 text-center">
                <div class="flex flex-col items-center text-slate-300">
                  <svg class="size-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p class="text-sm font-semibold text-slate-400">Không tìm thấy tài khoản nào</p>
                  <p class="mt-1 text-xs text-slate-300">Vui lòng thử lại với từ khóa hoặc bộ lọc khác</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>
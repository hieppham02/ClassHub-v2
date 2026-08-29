<script setup>
import AdminLayout from '@/components/admin/layout/AdminLayout.vue'
import { ref, computed, reactive } from 'vue'

const search = ref('')
const roleFilter = ref('Tất cả')
const showAddModal = ref(false)

const newAccount = reactive({ id: '', name: '', role: 'Sinh viên', classOrDept: '', email: '', phone: '' })

const accounts = ref([
  { id: '20231206', name: 'Phạm Hoàng Hiệp', role: 'Admin', class: 'DCCNTT.14.3', email: '20231206@eaut.edu.vn', phone: '0969299262' },
  { id: '20231047', name: 'Nguyễn Văn Đạt', role: 'Sinh viên', class: 'DCCNTT.14.3', email: '20231047@eaut.edu.vn', phone: '0123456789' },
  { id: '20231000', name: 'Kiều Thanh Ngân', role: 'Sinh viên', class: 'DCKT.14.1', email: '20231000@eaut.edu.vn', phone: '0987654321' },
  { id: 'GV001', name: 'Trần Văn A', role: 'Giảng viên', class: 'Khoa CNTT', email: 'tranvana@eaut.edu.vn', phone: '0912345678' }
])

const filteredAccounts = computed(() => {
  return accounts.value.filter(acc => {
    const matchRole = roleFilter.value === 'Tất cả' || acc.role === roleFilter.value
    const keyword = search.value.toLowerCase()
    const matchSearch = !keyword || acc.name.toLowerCase().includes(keyword) || acc.id.toLowerCase().includes(keyword) || acc.email.toLowerCase().includes(keyword)
    return matchRole && matchSearch
  })
})

function closeModal() {
  showAddModal.value = false
  Object.assign(newAccount, { id: '', name: '', role: 'Sinh viên', classOrDept: '', email: '', phone: '' })
}

function saveAccount() {
  if (!newAccount.id || !newAccount.name) return alert('Vui lòng nhập Mã và Họ tên!')
  accounts.value.unshift({ id: newAccount.id, name: newAccount.name, role: newAccount.role, class: newAccount.role === 'Admin' ? '---' : newAccount.classOrDept, email: newAccount.email, phone: newAccount.phone })
  closeModal()
}
</script>

<template>
  <AdminLayout>
    <div class="w-full">
      <!-- Header NEO CỐ ĐỊNH -->
      <div class="sticky top-0 z-40 bg-mist/95 backdrop-blur-sm border-b border-slate-200/60 shadow-sm px-4 sm:px-6 lg:px-32 pt-6 pb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Quản lý</p>
          <h1 class="mt-0.5 text-2xl font-black text-ink">Tài khoản người dùng</h1>
        </div>
        <button @click="showAddModal = true" class="h-10 rounded-xl bg-brand px-5 text-sm font-bold text-white shadow-md shadow-brand/20 hover:bg-brand-dark transition shrink-0">
          + Thêm tài khoản
        </button>
      </div>

      <!-- Nội dung Body -->
      <div class="px-4 sm:px-6 lg:px-32 pt-5 pb-10">
        <!-- Filter bar -->
        <div class="mb-5 flex flex-col sm:flex-row gap-3">
          <input v-model="search" type="text" placeholder="Tìm theo tên, mã SV/GV, email..." class="h-11 flex-1 rounded-xl border border-blue-100 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-brand shadow-sm" />
          <select v-model="roleFilter" class="h-11 rounded-xl border border-blue-100 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-brand sm:w-44 shadow-sm">
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
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Mã</th>
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Họ tên</th>
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Vai trò</th>
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Lớp / Khoa</th>
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Email</th>
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">SĐT</th>
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="acc in filteredAccounts" :key="acc.id" class="border-b border-blue-50 transition hover:bg-blue-50/30">
                  <td class="px-5 py-4 font-semibold text-ink whitespace-nowrap">{{ acc.id }}</td>
                  <td class="px-5 py-4 font-medium text-ink whitespace-nowrap">{{ acc.name }}</td>
                  <td class="px-5 py-4 whitespace-nowrap">
                    <span :class="{'bg-amber-100 text-amber-700': acc.role === 'Admin', 'bg-emerald-100 text-emerald-700': acc.role === 'Giảng viên', 'bg-blue-100 text-blue-700': acc.role === 'Sinh viên'}" class="rounded-md px-2.5 py-1 text-xs font-bold">{{ acc.role }}</span>
                  </td>
                  <td class="px-5 py-4 text-slate-500 whitespace-nowrap">{{ acc.class }}</td>
                  <td class="px-5 py-4 text-slate-500 whitespace-nowrap">{{ acc.email }}</td>
                  <td class="px-5 py-4 text-slate-500 whitespace-nowrap">{{ acc.phone }}</td>
                  <td class="px-5 py-4 whitespace-nowrap">
                    <div class="flex gap-3">
                      <button class="font-semibold text-brand hover:text-brand-dark transition">Sửa</button>
                      <button class="font-semibold text-red-500 hover:text-red-700 transition">Khóa</button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredAccounts.length === 0">
                  <td colspan="7" class="py-16 text-center text-slate-300">Không tìm thấy tài khoản nào</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
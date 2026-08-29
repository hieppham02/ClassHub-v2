<script setup>
import AdminLayout from '@/components/admin/layout/AdminLayout.vue'
import { ref, computed } from 'vue'

const search = ref('')
const statusFilter = ref('Tất cả trạng thái')
const showModal = ref(false)

const cabinets = ref([
  { id: 'C1', name: 'Tủ EAUT-101', building: 'Tòa EAUT', floor: 'Tầng 1', status: 'Trống', borrower: '---' },
  { id: 'C2', name: 'Tủ DTD-202', building: 'Đinh Trọng Dật', floor: 'Tầng 2', status: 'Đang mượn', borrower: 'Nguyễn Văn Đạt' }
])

const filteredCabinets = computed(() => {
  return cabinets.value.filter(c => {
    const matchStatus = statusFilter.value === 'Tất cả trạng thái' || c.status === statusFilter.value
    const keyword = search.value.toLowerCase()
    const matchSearch = !keyword || c.name.toLowerCase().includes(keyword) || c.building.toLowerCase().includes(keyword) || c.borrower.toLowerCase().includes(keyword)
    return matchStatus && matchSearch
  })
})
</script>

<template>
  <AdminLayout>
    <div class="w-full">
      <!-- Header NEO CỐ ĐỊNH -->
      <div class="sticky top-0 z-40 bg-mist/95 backdrop-blur-sm border-b border-slate-200/60 shadow-sm px-4 sm:px-6 lg:px-32 pt-6 pb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Quản lý</p>
          <h1 class="mt-0.5 text-2xl font-black text-ink">Tủ đồ thiết bị</h1>
        </div>
        <button @click="showModal = true" class="h-10 rounded-xl bg-brand px-5 text-sm font-bold text-white shadow-md shadow-brand/20 hover:bg-brand-dark transition shrink-0">
          + Thêm tủ mới
        </button>
      </div>

      <!-- Nội dung Body -->
      <div class="px-4 sm:px-6 lg:px-32 pt-5 pb-10">
        <!-- Filter bar -->
        <div class="mb-5 flex flex-col sm:flex-row gap-3">
          <input v-model="search" type="text" placeholder="Tìm theo tên tủ, tòa nhà, tầng..." class="h-11 flex-1 rounded-xl border border-blue-100 bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-brand shadow-sm" />
          <select v-model="statusFilter" class="h-11 rounded-xl border border-blue-100 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-brand sm:w-44 shadow-sm">
            <option>Tất cả trạng thái</option>
            <option>Trống</option>
            <option>Đang mượn</option>
            <option>Bảo trì</option>
          </select>
        </div>

        <!-- Table -->
        <div class="rounded-2xl border border-blue-100 bg-white shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-blue-50 bg-blue-50/60">
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Tên tủ</th>
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Tòa nhà</th>
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Tầng</th>
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Trạng thái</th>
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Người đang mượn</th>
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cab in filteredCabinets" :key="cab.id" class="border-b border-blue-50 transition hover:bg-blue-50/30">
                  <td class="px-5 py-4 font-bold text-ink whitespace-nowrap">{{ cab.name }}</td>
                  <td class="px-5 py-4 font-medium text-slate-600 whitespace-nowrap">{{ cab.building }}</td>
                  <td class="px-5 py-4 font-medium text-slate-600 whitespace-nowrap">{{ cab.floor }}</td>
                  <td class="px-5 py-4 whitespace-nowrap">
                    <span :class="{'bg-emerald-100 text-emerald-700': cab.status === 'Trống', 'bg-amber-100 text-amber-700': cab.status === 'Đang mượn', 'bg-red-100 text-red-700': cab.status === 'Bảo trì'}" class="rounded-md px-2.5 py-1 text-xs font-bold">{{ cab.status }}</span>
                  </td>
                  <td class="px-5 py-4 font-medium text-slate-600 whitespace-nowrap">{{ cab.borrower }}</td>
                  <td class="px-5 py-4 whitespace-nowrap">
                    <div class="flex gap-3"><button class="font-semibold text-brand hover:text-brand-dark transition">Sửa</button><button class="font-semibold text-red-500 hover:text-red-700 transition">Khóa</button></div>
                  </td>
                </tr>
                <tr v-if="filteredCabinets.length === 0">
                  <td colspan="6" class="py-16 text-center text-slate-300">Không tìm thấy dữ liệu.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
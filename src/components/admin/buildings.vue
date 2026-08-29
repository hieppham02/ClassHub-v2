<script setup>
import AdminLayout from '@/components/admin/layout/AdminLayout.vue'
import { ref, reactive, computed } from 'vue'

const activeTab = ref('buildings')

const buildings = ref([
  { id: 'EAUT', name: 'Tòa EAUT', floors: 9, rooms: 25 },
  { id: 'DTD', name: 'Đinh Trọng Dật', floors: 5, rooms: 15 },
  { id: 'VNB', name: 'Việt Nam Building', floors: 4, rooms: 12 }
])

const rooms = ref([
  { id: 'EAUT101', name: 'EAUT-101', building: 'Tòa EAUT', floor: 'Tầng 1', status: 'Sẵn sàng' },
  { id: 'EAUT102', name: 'EAUT-102', building: 'Tòa EAUT', floor: 'Tầng 1', status: 'Đang mượn' }
])

const showModal = ref(false)
const modalType = ref('buildings')

const newBuilding = reactive({ name: '', floors: 1 })
const newRoom = reactive({ name: '', building: '', floor: '', quantity: 1 })

function openModal() { modalType.value = activeTab.value; showModal.value = true }
function closeModal() { showModal.value = false }
</script>

<template>
  <AdminLayout>
    <div class="w-full">
      <!-- Header NEO CỐ ĐỊNH -->
      <div class="sticky top-0 z-40 bg-mist/95 backdrop-blur-sm border-b border-slate-200/60 shadow-sm px-4 sm:px-6 lg:px-32 pt-6 pb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Quản lý</p>
          <h1 class="mt-0.5 text-2xl font-black text-ink">Tòa nhà &amp; Phòng học</h1>
        </div>
        <button @click="openModal" class="h-10 rounded-xl bg-brand px-5 text-sm font-bold text-white shadow-md shadow-brand/20 hover:bg-brand-dark transition shrink-0">
          + Thêm mới
        </button>
      </div>

      <!-- Nội dung Body -->
      <div class="px-4 sm:px-6 lg:px-32 pt-5 pb-10">
        <!-- Tabs -->
        <div class="mb-5 flex gap-1 rounded-xl bg-blue-50 p-1 w-fit shadow-sm">
          <button @click="activeTab = 'buildings'" :class="activeTab === 'buildings' ? 'bg-white text-brand font-bold shadow-sm' : 'text-slate-500 font-medium hover:text-brand'" class="rounded-lg px-6 py-2 text-sm transition">Tòa nhà</button>
          <button @click="activeTab = 'rooms'" :class="activeTab === 'rooms' ? 'bg-white text-brand font-bold shadow-sm' : 'text-slate-500 font-medium hover:text-brand'" class="rounded-lg px-6 py-2 text-sm transition">Phòng học</button>
        </div>

        <!-- Buildings tab -->
        <div v-if="activeTab === 'buildings'" class="rounded-2xl border border-blue-100 bg-white shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-blue-50 bg-blue-50/60">
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Tên tòa</th>
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Số tầng</th>
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Số phòng</th>
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="b in buildings" :key="b.id" class="border-b border-blue-50 transition hover:bg-blue-50/30">
                  <td class="px-5 py-4 font-bold text-ink whitespace-nowrap">{{ b.name }}</td>
                  <td class="px-5 py-4 font-medium text-slate-600 whitespace-nowrap">{{ b.floors }} tầng</td>
                  <td class="px-5 py-4 font-medium text-slate-600 whitespace-nowrap">{{ b.rooms }} phòng</td>
                  <td class="px-5 py-4 whitespace-nowrap">
                    <div class="flex gap-3"><button class="font-semibold text-brand hover:text-brand-dark transition">Sửa</button><button class="font-semibold text-red-500 hover:text-red-700 transition">Xóa</button></div>
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
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Tên phòng</th>
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Tòa nhà</th>
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Tầng</th>
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Trạng thái tủ</th>
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in rooms" :key="r.id" class="border-b border-blue-50 transition hover:bg-blue-50/30">
                  <td class="px-5 py-4 font-bold text-ink whitespace-nowrap">{{ r.name }}</td>
                  <td class="px-5 py-4 font-medium text-slate-600 whitespace-nowrap">{{ r.building }}</td>
                  <td class="px-5 py-4 font-medium text-slate-600 whitespace-nowrap">{{ r.floor }}</td>
                  <td class="px-5 py-4 whitespace-nowrap">
                    <span :class="{'bg-emerald-100 text-emerald-700': r.status === 'Sẵn sàng', 'bg-amber-100 text-amber-700': r.status === 'Đang mượn', 'bg-red-100 text-red-700': r.status === 'Bảo trì'}" class="rounded-md px-2.5 py-1 text-xs font-bold">{{ r.status }}</span>
                  </td>
                  <td class="px-5 py-4 whitespace-nowrap">
                    <div class="flex gap-3"><button class="font-semibold text-brand hover:text-brand-dark transition">Sửa</button><button class="font-semibold text-red-500 hover:text-red-700 transition">Xóa</button></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
<script setup>
import AdminLayout from '@/components/admin/layout/AdminLayout.vue'
import { ref, computed } from 'vue'

const search = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const statusFilter = ref('Tất cả')

const mockHistory = ref([
  { id: 1, room: 'DTD-201', slot: 'Ca 1', date: '2026-04-15', borrower: 'Phạm Hoàng Hiệp', phoneBorrow: '0969299262', timeBorrow: '07:15', returner: 'Kiều Thanh Ngân', phoneReturn: '0987654321', timeReturn: '11:30', status: 'COMPLETED' },
  { id: 2, room: 'EAUT-102', slot: 'Ca 2', date: '2026-04-15', borrower: 'Nguyễn Văn Đạt', phoneBorrow: '0123456789', timeBorrow: '12:30', returner: '---', phoneReturn: '---', timeReturn: '---', status: 'IN_USE' },
  { id: 3, room: 'VNB-208', slot: 'Ca 3', date: '2026-04-14', borrower: 'Kiều Thanh Ngân', phoneBorrow: '0987654321', timeBorrow: '18:00', returner: 'Kiều Thanh Ngân', phoneReturn: '0987654321', timeReturn: '20:15', status: 'COMPLETED' },
  { id: 4, room: 'EAUT-101', slot: 'Ca 1', date: '2026-04-16', borrower: 'Trần Văn A', phoneBorrow: '0911223344', timeBorrow: '07:05', returner: '---', phoneReturn: '---', timeReturn: '---', status: 'PENDING' }
])

const filteredHistory = computed(() => {
  return mockHistory.value.filter(item => {
    const keyword = search.value.toLowerCase()
    const matchSearch = !keyword ||
      item.room.toLowerCase().includes(keyword) ||
      item.borrower.toLowerCase().includes(keyword) ||
      item.returner.toLowerCase().includes(keyword)

    const matchFrom = !dateFrom.value || item.date >= dateFrom.value
    const matchTo = !dateTo.value || item.date <= dateTo.value
    const matchStatus = statusFilter.value === 'Tất cả' || item.status === statusFilter.value
    return matchSearch && matchFrom && matchTo && matchStatus
  })
})

function exportCSV() {
  if (filteredHistory.value.length === 0) return alert('Không có dữ liệu để xuất!')
  const headers = ['Tên phòng', 'Ca học', 'Ngày mượn', 'Người mượn', 'SĐT mượn', 'Mượn lúc', 'Người trả', 'SĐT trả', 'Trả lúc', 'Trạng thái']
  const rows = filteredHistory.value.map(row => [row.room, row.slot, row.date, row.borrower, row.phoneBorrow, row.timeBorrow, row.returner, row.phoneReturn, row.timeReturn, row.status])
  const csvContent = [headers.join(','), ...rows.map(r => r.map(field => `"${field}"`).join(','))].join('\n')
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `LichSuMuonTra_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <AdminLayout>
    <div class="w-full">
      <!-- Header NEO CỐ ĐỊNH -->
      <div class="sticky top-0 z-40 bg-mist/95 backdrop-blur-sm border-b border-slate-200/60 shadow-sm px-4 sm:px-6 lg:px-32 pt-6 pb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Quản lý</p>
          <h1 class="mt-0.5 text-2xl font-black text-ink">Lịch sử mượn trả</h1>
        </div>
        <button @click="exportCSV" class="h-10 rounded-xl border border-brand px-5 text-sm font-bold text-brand hover:bg-blue-50 transition shrink-0 bg-white">
          ↓ Xuất CSV
        </button>
      </div>

      <!-- Nội dung Body -->
      <div class="px-4 sm:px-6 lg:px-32 pt-5 pb-10">
        <!-- Filter bar -->
        <div class="mb-5 flex flex-col xl:flex-row items-end gap-3">
          <div class="relative w-full xl:flex-1">
            <input v-model="search" type="text" placeholder="Tìm tên phòng, người mượn, người trả..." class="h-11 w-full rounded-xl border border-blue-100 bg-white px-4 pr-10 text-sm outline-none focus:ring-2 focus:ring-brand shadow-sm" />
            <button v-if="search" @click="search = ''" class="absolute right-3 top-1/2 -translate-y-1/2 flex size-6 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
              <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div class="flex flex-col sm:flex-row w-full xl:w-auto gap-3">
            <label class="w-full sm:w-auto grid gap-1 text-xs font-semibold text-slate-500 shrink-0">
              Trạng thái
              <select v-model="statusFilter" class="h-11 w-full sm:w-36 rounded-xl border border-blue-100 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-brand shadow-sm">
                <option>Tất cả</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="IN_USE">IN_USE</option>
                <option value="PENDING">PENDING</option>
              </select>
            </label>
            <label class="w-full sm:w-auto grid gap-1 text-xs font-semibold text-slate-500 shrink-0">
              Từ ngày
              <input v-model="dateFrom" type="date" class="h-11 w-full sm:w-36 rounded-xl border border-blue-100 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-brand shadow-sm" />
            </label>
            <label class="w-full sm:w-auto grid gap-1 text-xs font-semibold text-slate-500 shrink-0">
              Đến ngày
              <input v-model="dateTo" type="date" class="h-11 w-full sm:w-36 rounded-xl border border-blue-100 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-brand shadow-sm" />
            </label>
          </div>
        </div>

        <!-- Table -->
        <div class="rounded-2xl border border-blue-100 bg-white shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-blue-50 bg-blue-50/60">
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Tên phòng</th>
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Ca học</th>
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Ngày mượn</th>
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Người mượn</th>
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">SĐT mượn</th>
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Mượn lúc</th>
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Người trả</th>
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">SĐT trả</th>
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Trả lúc</th>
                  <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="record in filteredHistory" :key="record.id" class="border-b border-blue-50 transition hover:bg-blue-50/30">
                  <td class="px-5 py-3 font-bold text-ink whitespace-nowrap">{{ record.room }}</td>
                  <td class="px-5 py-3 text-slate-600 whitespace-nowrap">{{ record.slot }}</td>
                  <td class="px-5 py-3 text-slate-600 whitespace-nowrap">{{ record.date }}</td>
                  <td class="px-5 py-3 font-medium text-ink whitespace-nowrap">{{ record.borrower }}</td>
                  <td class="px-5 py-3 text-slate-600 whitespace-nowrap">{{ record.phoneBorrow }}</td>
                  <td class="px-5 py-3 font-semibold text-slate-700 whitespace-nowrap">{{ record.timeBorrow }}</td>
                  <td class="px-5 py-3 font-medium text-ink whitespace-nowrap">{{ record.returner }}</td>
                  <td class="px-5 py-3 text-slate-600 whitespace-nowrap">{{ record.phoneReturn }}</td>
                  <td class="px-5 py-3 font-semibold text-slate-700 whitespace-nowrap">{{ record.timeReturn }}</td>
                  <td class="px-5 py-3 whitespace-nowrap">
                    <span :class="{'bg-emerald-100 text-emerald-700': record.status === 'COMPLETED', 'bg-amber-100 text-amber-700': record.status === 'IN_USE', 'bg-blue-100 text-blue-700': record.status === 'PENDING'}" class="rounded-md px-2.5 py-1 text-xs font-bold">{{ record.status }}</span>
                  </td>
                </tr>
                <tr v-if="filteredHistory.length === 0">
                  <td colspan="10" class="py-16 text-center text-slate-300">Không tìm thấy dữ liệu</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
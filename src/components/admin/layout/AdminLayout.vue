<script setup>
import { ref, onMounted } from 'vue'
import AdminSidebar from '@/components/admin/layout/AdminSidebar.vue'

const currentPath = ref(window.location.pathname)
const adminName = ref('')

function logout() {
  sessionStorage.removeItem('classhub-token')
  sessionStorage.removeItem('classhub-user')
  window.location.href = '/login'
}

onMounted(() => {
  const saved = sessionStorage.getItem('classhub-user')
  if (!saved) return (window.location.href = '/login')
  try {
    const user = JSON.parse(saved)
    if (user.role !== 'ADMIN') return (window.location.href = '/')
    adminName.value = user.name || ''
  } catch {
    window.location.href = '/login'
  }
})
</script>

<template>
  <div class="flex min-h-screen bg-mist">
    <!-- Sidebar -->
    <AdminSidebar :currentPath="currentPath" :adminName="adminName" @logout="logout" />

    <!-- Main content area -->
    <div class="flex flex-1 flex-col min-w-0">
      <!-- Top bar (mobile only) — shows page context -->
      <header class="sm:hidden flex items-center gap-3 border-b border-blue-100 bg-white px-4 py-3 sticky top-0 z-30">
        <div class="flex size-8 items-center justify-center rounded-xl bg-blue-50">
          <img src="https://eaut.edu.vn/favicon.ico" class="size-5 object-contain" alt="Logo" />
        </div>
        <div>
          <p class="text-sm font-bold text-brand leading-tight">Class Hub Admin</p>
          <p class="text-[10px] text-slate-400">Hệ thống quản trị</p>
        </div>
        <button @click="logout" class="ml-auto rounded-lg border border-blue-100 px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50">
          Xuất
        </button>
      </header>

      <!-- Scrollable page content -->
      <main class="flex-1 overflow-auto px-5 py-6 pb-24 sm:pb-6 lg:px-8">
        <slot />
      </main>
    </div>
  </div>
</template>


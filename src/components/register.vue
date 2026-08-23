<script setup>
import { ref } from 'vue'

const name = ref('') 
const email = ref('') 
const password = ref('') 
const error = ref('')

function register() { 
  if (!name.value || !email.value || password.value.length < 6) { 
    error.value = 'Nhập đủ thông tin, mật khẩu tối thiểu 6 ký tự.'
    return 
  }
  sessionStorage.setItem('eaut-user', JSON.stringify({ 
    name: name.value, 
    role: 'Sinh viên', 
    email: email.value 
  }))
  window.location.href = '/' 
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-mist px-5 py-10">
    <section class="w-full max-w-md rounded-3xl border border-blue-100 bg-white p-8 shadow-xl shadow-blue-100">
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-bold text-ink">Tạo tài khoản</h1>
        <p class="mt-2 text-sm text-slate-500">Đăng ký để quản lý lịch mượn phòng</p>
      </div>
      <form class="grid gap-4" @submit.prevent="register">
        <label class="grid gap-2 text-sm font-semibold text-ink">Họ và tên
          <input v-model="name" required class="h-11 rounded-xl border border-blue-100 bg-mist px-3 outline-none focus:ring-2 focus:ring-brand" />
        </label>
        <label class="grid gap-2 text-sm font-semibold text-ink">Email
          <input v-model="email" type="email" required class="h-11 rounded-xl border border-blue-100 bg-mist px-3 outline-none focus:ring-2 focus:ring-brand" />
        </label>
        <label class="grid gap-2 text-sm font-semibold text-ink">Mật khẩu
          <input v-model="password" type="password" required class="h-11 rounded-xl border border-blue-100 bg-mist px-3 outline-none focus:ring-2 focus:ring-brand" />
        </label>
        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
        <button class="h-11 rounded-xl bg-brand font-bold text-white hover:bg-brand-dark">Đăng ký</button>
      </form>
      <p class="mt-6 text-center text-sm text-slate-500">Đã có tài khoản? 
        <a href="/login" class="font-bold text-brand hover:underline">Đăng nhập</a>
      </p>
    </section>
  </main>
</template>
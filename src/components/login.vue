<script setup>
import { ref } from 'vue'

const url = import.meta.env.VITE_API_URL
const msv = ref('')
const mk = ref('')
const error = ref('')

async function login() {
  if (!msv.value || !mk.value) {
    error.value = 'Vui lòng nhập đầy đủ thông tin.'
    return
  }

  try {
    const response = await fetch(url + '/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        maSv: msv.value,
        matKhau: mk.value
      })
    })

    const data = await response.json()

    if (!response.ok) {
      error.value = data.message || 'Đăng nhập thất bại!'
      return
    }

    sessionStorage.setItem('classhub-token', data.token)
    sessionStorage.setItem('classhub-user', JSON.stringify(data.user))


    const userRole = data.user.role
    if (userRole === "ADMIN") {
      window.location.href = '/admin'
    } else {
      window.location.href = '/'
    }
  } catch (err) {
    console.error(err)
    error.value = 'Không thể kết nối đến máy chủ!'
  }
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-mist px-5 py-10">
    <section class="w-full max-w-md rounded-3xl border border-blue-100 bg-white p-8 shadow-xl shadow-blue-100">
      <div class="mb-8 text-center">
        <img src="https://eaut.edu.vn/favicon.ico" alt="Logo Đại học Công nghệ Đông Á"
          class="mx-auto mb-4 size-14 object-contain" />
        <h1 class="text-2xl font-bold text-ink">Đăng nhập</h1>
        <p class="mt-2 text-sm text-slate-500">Hệ thống Mượn trả EAUT</p>
      </div>
      <form class="grid gap-4" @submit.prevent="login">
        <label class="grid gap-2 text-sm font-semibold text-ink">Mã sinh viên
          <input v-model="msv" type="text" required placeholder=""
            class="h-11 rounded-xl border border-blue-100 bg-mist px-3 outline-none focus:ring-2 focus:ring-brand" />
        </label>
        <label class="grid gap-2 text-sm font-semibold text-ink">Mật khẩu
          <input v-model="mk" type="password" required placeholder=""
            class="h-11 rounded-xl border border-blue-100 bg-mist px-3 outline-none focus:ring-2 focus:ring-brand" />
        </label>
        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
        <button class="mt-2 h-11 rounded-xl bg-brand font-bold text-white hover:bg-brand-dark">Đăng nhập</button>
      </form>
      <p class="mt-6 text-center text-sm text-slate-500">Chưa có tài khoản?
        <a href="/register" class="font-bold text-brand hover:underline">Đăng ký</a>
      </p>
    </section>
  </main>
</template>
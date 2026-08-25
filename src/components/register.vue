<script setup>
import { ref } from 'vue'

const url = import.meta.env.VITE_API_URL

const maSv = ref('')
const hoTen = ref('')
const tenLop = ref('')
const sdt = ref('')
const email = ref('')
const matKhau = ref('')
const xacNhanMatKhau = ref('')

const error = ref('')
const success = ref('')
const isLoading = ref(false)

async function register() { 
  error.value = ''
  success.value = ''

  if (!maSv.value || !hoTen.value || !email.value || !matKhau.value || !xacNhanMatKhau.value) { 
    error.value = 'Vui lòng nhập đầy đủ các trường bắt buộc (*).'
    return 
  }
  
  if (matKhau.value.length < 6) {
    error.value = 'Mật khẩu phải có ít nhất 6 ký tự.'
    return
  }

  if (matKhau.value !== xacNhanMatKhau.value) {
    error.value = 'Mật khẩu xác nhận không trùng khớp!'
    return
  }

  isLoading.value = true
  try {
    const response = await fetch(url + '/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        MaSV: maSv.value,
        HoTen: hoTen.value,
        Email: email.value,
        MatKhau: matKhau.value,
        Sdt: sdt.value,
        TenLop: tenLop.value
      })
    })

    const data = await response.json()

    if (response.ok) {
      success.value = 'Đăng ký thành công! Đang chuyển hướng đến đăng nhập...'
      setTimeout(() => {
        window.location.href = '/login'
      }, 1500)
    } else {
      error.value = data.message || 'Có lỗi xảy ra, không thể đăng ký!'
    }
  } catch (err) {
    console.error('Lỗi API Đăng ký:', err)
    error.value = 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-mist px-4 py-10 sm:px-5">
    <!-- Form to hơn một chút để chứa 2 cột -->
    <section class="w-full max-w-lg rounded-3xl border border-blue-100 bg-white p-6 sm:p-8 shadow-xl shadow-blue-100">
      
      <div class="mb-8 text-center">
        <div class="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-blue-50 ring-1 ring-blue-100">
          <img src="https://eaut.edu.vn/favicon.ico" class="size-8 object-contain" alt="Logo" />
        </div>
        <h1 class="text-2xl font-bold text-ink">Tạo tài khoản Class Hub</h1>
        <p class="mt-2 text-sm text-slate-500">Điền thông tin của bạn để bắt đầu sử dụng hệ thống</p>
      </div>

      <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="register">
        
        <!-- Hàng 1 -->
        <label class="grid gap-2 text-sm font-semibold text-ink sm:col-span-1">Mã sinh viên <span class="text-red-500 inline">*</span>
          <input v-model="maSv" required placeholder="Ví dụ: 2026110..." class="h-11 rounded-xl border border-blue-100 bg-mist px-3 outline-none focus:ring-2 focus:ring-brand placeholder:text-slate-400 font-medium" />
        </label>
        <label class="grid gap-2 text-sm font-semibold text-ink sm:col-span-1">Họ và tên <span class="text-red-500 inline">*</span>
          <input v-model="hoTen" required placeholder="Nguyễn Văn A" class="h-11 rounded-xl border border-blue-100 bg-mist px-3 outline-none focus:ring-2 focus:ring-brand placeholder:text-slate-400 font-medium" />
        </label>

        <!-- Hàng 2 -->
        <label class="grid gap-2 text-sm font-semibold text-ink sm:col-span-1">Lớp học
          <input v-model="tenLop" placeholder="VD: IT1" class="h-11 rounded-xl border border-blue-100 bg-mist px-3 outline-none focus:ring-2 focus:ring-brand placeholder:text-slate-400 font-medium" />
        </label>
        <label class="grid gap-2 text-sm font-semibold text-ink sm:col-span-1">Số điện thoại
          <input v-model="sdt" type="tel" placeholder="0912345678" class="h-11 rounded-xl border border-blue-100 bg-mist px-3 outline-none focus:ring-2 focus:ring-brand placeholder:text-slate-400 font-medium" />
        </label>

        <!-- Hàng 3: Email chiếm trọn 2 cột -->
        <label class="grid gap-2 text-sm font-semibold text-ink sm:col-span-2">Email EAUT <span class="text-red-500 inline">*</span>
          <input v-model="email" type="email" required placeholder="masv@eaut.edu.vn" class="h-11 rounded-xl border border-blue-100 bg-mist px-3 outline-none focus:ring-2 focus:ring-brand placeholder:text-slate-400 font-medium" />
        </label>

        <!-- Hàng 4 -->
        <label class="grid gap-2 text-sm font-semibold text-ink sm:col-span-1">Mật khẩu <span class="text-red-500 inline">*</span>
          <input v-model="matKhau" type="password" required placeholder="Tối thiểu 6 ký tự" class="h-11 rounded-xl border border-blue-100 bg-mist px-3 outline-none focus:ring-2 focus:ring-brand placeholder:text-slate-400 font-medium" />
        </label>
        <label class="grid gap-2 text-sm font-semibold text-ink sm:col-span-1">Xác nhận mật khẩu <span class="text-red-500 inline">*</span>
          <input v-model="xacNhanMatKhau" type="password" required placeholder="Nhập lại mật khẩu" class="h-11 rounded-xl border border-blue-100 bg-mist px-3 outline-none focus:ring-2 focus:ring-brand placeholder:text-slate-400 font-medium" />
        </label>

        <div class="sm:col-span-2">
          <p v-if="error" class="text-sm font-medium text-red-600 rounded-lg bg-red-50 p-3 text-center">{{ error }}</p>
          <p v-if="success" class="text-sm font-medium text-emerald-600 rounded-lg bg-emerald-50 p-3 text-center">{{ success }}</p>
        </div>

        <button :disabled="isLoading" class="mt-2 h-12 sm:col-span-2 rounded-xl bg-brand font-bold text-white transition hover:bg-brand-dark disabled:opacity-70 flex items-center justify-center">
          <span v-if="isLoading" class="size-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
          {{ isLoading ? 'Đang xử lý...' : 'Đăng ký tài khoản' }}
        </button>

      </form>

      <p class="mt-6 text-center text-sm font-medium text-slate-500">Đã có tài khoản? 
        <a href="/login" class="font-bold text-brand hover:underline">Đăng nhập ngay</a>
      </p>
    </section>
  </main>
</template>
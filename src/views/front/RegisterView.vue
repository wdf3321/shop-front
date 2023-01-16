<template lang="pug">
#register
  v-row
    v-col(cols="12")
      h1.text-center 註冊
    v-divider
    v-col(cols="12")
      v-form(v-model="valid" @submit.prevent="register")
        v-text-field(v-model="form.email" type="email" :rules="[rules.email, rules.required]" label="信箱")
        v-text-field(v-model="form.account" type="text" :rules="[rules.required, rules.length]" label="帳號" counter="20" maxlength="20")
        v-text-field(v-model="form.password" type="password" :rules="[rules.required, rules.length]" label="密碼" counter="20" maxlength="20")
        v-text-field(v-model="form.passwordConfirm" type="password" :rules="[rules.required, rules.length, rules.passwordConfirm]" label="確認密碼" counter="20" maxlength="20")
        .text-center.my-5
          v-btn(color="success" type="submit" size="large" :loading="loading") 註冊
</template>

<script setup>
import { ref, reactive } from 'vue'
import validator from 'validator'
import { api } from '@/plugins/axios'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'

const router = useRouter()

const valid = ref(false)
const loading = ref(false)
const form = reactive({
  account: '',
  password: '',
  passwordConfirm: '',
  email: ''
})

const rules = {
  email (value) {
    return validator.isEmail(value) || '格式錯誤'
  },
  required (value) {
    return !!value || '欄位必填'
  },
  length (value) {
    return (value.length >= 4 && value.length <= 20) || '長度必須為 4 ~ 20 個字'
  },
  passwordConfirm (value) {
    return (value === form.password) || '密碼不一致'
  }
}

const register = async () => {
  if (!valid.value) return
  loading.value = true
  try {
    await api.post('/users', form)
    await Swal.fire({
      icon: 'success',
      title: '成功',
      text: '註冊成功'
    })
    router.push('/')
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: error?.response?.data?.message || '發生錯誤'
    })
  }
  loading.value = false
}
</script>

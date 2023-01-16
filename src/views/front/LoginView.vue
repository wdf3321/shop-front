<template lang="pug">
#login
  v-row
    v-col(cols="12")
      h1.text-center 登入
    v-divider
    v-col(cols="12")
      v-form(v-model="valid" @submit.prevent="login")
        v-text-field(v-model="form.account" type="text" :rules="[rules.required, rules.length]" label="帳號" counter="20" maxlength="20")
        v-text-field(v-model="form.password" type="password" :rules="[rules.required, rules.length]" label="密碼" counter="20" maxlength="20")
        .text-center.my-5
          v-btn(color="success" type="submit" size="large" :loading="loading") 登入
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores/user'

const user = useUserStore()

const valid = ref(false)
const loading = ref(false)
const form = reactive({
  account: '',
  password: ''
})

const rules = {
  required (value) {
    return !!value || '欄位必填'
  },
  length (value) {
    return (value.length >= 4 && value.length <= 20) || '長度必須為 4 ~ 20 個字'
  }
}

const login = async () => {
  loading.value = true
  await user.login(form)
  loading.value = false
}
</script>

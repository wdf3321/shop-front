<template lang="pug">
#admin-products
  h1.text-center 商品管理
  v-divider
  v-row
    v-col(cols="12")
      v-btn(color="success" @click="openDialog(-1)") 新增商品
    v-col(cols="12")
      v-table
        thead
          tr
            th 圖片
            th 名稱
            th 管理
        tbody
          tr(v-for="(product, idx) in products" :key="product._id")
            td
              v-img(:src="product.image" :aspect-ratio="1" :width="200")
            td {{ product.name }}
            td
              v-btn(color="primary" icon="mdi-pencil" variant="text" @click="openDialog(idx)")
  v-dialog(v-model="form.dialog" persistent)
    v-form(v-model="form.valid" @submit.prevent="submit")
      v-card
        v-card-title
          h1.text-center {{ form._id.length > 0 ? '編輯商品' : '新增商品' }}
        v-card-text
          v-row
            v-col(cols="12")
              v-text-field(v-model="form.name" type="text" label="名稱" :rules="[rules.required]")
            v-col(cols="12")
              v-text-field(v-model="form.price" type="number" label="價格" :rules="[rules.required, rules.price]")
            v-col(cols="12")
              v-textarea(v-model="form.description" rows="3" auto-grow label="說明" :rules="[rules.required]")
            v-col(cols="12")
              v-select(v-model="form.category" :items="categories" :rules="[rules.required]")
            v-col(cols="12")
              v-checkbox(v-model="form.sell" label="上架")
            v-col(cols="12")
              v-image-input.mx-auto(v-model="form.image" removable :max-file-size="1")
        v-card-actions
          v-spacer
          v-btn(:disabled="form.loading" color="red" @click="form.dialog = false") 取消
          v-btn(:disabled="form.loading" color="green" type="submit") 送出
</template>

<script setup>
import { apiAuth } from '@/plugins/axios'
import { reactive } from 'vue'
import Swal from 'sweetalert2'

const categories = ['衣服', '皮件', '鞋子', '飾品', '3C', '其他']
const rules = {
  required (value) {
    return !!value || '欄位必填'
  },
  price (value) {
    return value >= 0 || '價格錯誤'
  }
}

const products = reactive([])
const form = reactive({
  _id: '',
  name: '',
  price: 0,
  description: '',
  image: undefined,
  sell: false,
  category: '',
  valid: false,
  loading: false,
  dialog: false,
  idx: -1
})

const openDialog = (idx) => {
  if (idx === -1) {
    form._id = ''
    form.name = ''
    form.price = 0
    form.description = ''
    form.image = undefined
    form.sell = false
    form.category = ''
    form.valid = false
    form.loading = false
    form.idx = -1
  } else {
    form._id = products[idx]._id
    form.name = products[idx].name
    form.price = products[idx].price
    form.description = products[idx].description
    form.image = undefined
    form.sell = products[idx].sell
    form.category = products[idx].category
    form.valid = false
    form.loading = false
    form.idx = idx
  }
  form.dialog = true
}

const submit = async () => {
  if (!form.valid) return

  form.loading = true

  // fd.append(key, value)
  const fd = new FormData()
  fd.append('name', form.name)
  fd.append('price', form.price)
  fd.append('description', form.description)
  fd.append('image', form.image)
  fd.append('sell', form.sell)
  fd.append('category', form.category)

  try {
    if (form._id.length === 0) {
      const { data } = await apiAuth.post('/products', fd)
      products.push(data.result)
      Swal.fire({
        icon: 'success',
        title: '成功',
        text: '新增成功'
      })
    } else {
      const { data } = await apiAuth.patch('/products/' + form._id, fd)
      products[form.idx] = data.result
      Swal.fire({
        icon: 'success',
        title: '成功',
        text: '編輯成功'
      })
    }
    form.dialog = false
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: error?.response?.data?.message || '發生錯誤'
    })
  }

  form.loading = false
}

(async () => {
  try {
    const { data } = await apiAuth.get('/products/all')
    products.push(...data.result)
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: error?.response?.data?.message || '發生錯誤'
    })
  }
})()
</script>

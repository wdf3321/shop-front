<template lang="pug">
#product
  v-row
    v-col(cols="12")
      h1.text-center {{ product.name }}
    v-divider
    v-col(cols="12")
      v-img(:src="product.image")
    v-col(cols="12")
      p ${{ product.price }}
      p.pre {{ product.description }}
    v-col(cols="12")
      v-form(v-model="valid" @submit.prevent="submitCart")
        v-text-field(v-model.number="quantity" type="number" label="數量" :rules="[rules.required, rules.number]")
        v-btn(type="submit" color="primary") 加入購物車
  v-overlay.align-center.justify-center.text-center(:model-value="!product.sell" persistent)
    h1.text-red 已下架
    v-btn(@click="router.go(-1)") 回上頁
</template>

<script setup>
import { reactive, ref } from 'vue'
import { api } from '@/plugins/axios'
import { useRoute, useRouter } from 'vue-router'
import { Swal } from 'sweetalert2'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()

const user = useUserStore()
const { editCart } = user

const valid = ref(false)
const quantity = ref(0)

const rules = {
  required (value) {
    return !!value || '欄位必填'
  },
  number (value) {
    return value > 0 || '數量錯誤'
  }
}

const product = reactive({
  _id: '',
  name: '',
  price: 0,
  description: '',
  image: '',
  sell: true,
  category: ''
})

const submitCart = () => {
  if (!valid.value) return
  editCart({ _id: product._id, quantity: quantity.value })
}

(async () => {
  try {
    const { data } = await api.get('/products/' + route.params.id)
    product._id = data.result._id
    product.name = data.result.name
    product.price = data.result.price
    product.description = data.result.description
    product.image = data.result.image
    product.sell = data.result.sell
    product.category = data.result.category

    document.title = '購物網 | ' + product.name
    // document.querySelector('meta[property="og:title"]').setAttribute('content', product.name)
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: '取得商品失敗'
    })
    router.go(-1)
  }
})()
</script>

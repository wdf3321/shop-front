<template lang="pug">
#cart
  v-row
    v-col(cols="12")
      h1.text-center 購物車
    v-divider
    v-col(cols="12")
      v-table
        thead
          tr
            th 圖片
            th 名稱
            th 單價
            th 數量
            th 小計
            th 操作
        tbody
          tr(v-for="(product, idx) in cart" :key="product._id" :class="{'bg-red': !product.p_id.sell}")
            td
              v-img(:aspect-ratio="1" :width="200" :src="product.p_id.image")
            td {{ product.p_id.name }}
            td {{ product.p_id.price }}
            td
              v-btn(color="primary" @click="updateCart(idx, -1)") -
              | &nbsp;{{ product.quantity }}&nbsp;
              v-btn(color="primary" @click="updateCart(idx, 1)") +
            td {{ product.quantity * product.p_id.price }}
            td
              v-btn(color="red" @click="updateCart(idx, product.quantity*-1)") 刪除
          tr(v-if="cart.length === 0")
            td.text-center(colspan="6") 沒有商品
    v-divider
    v-col.text-center(cols="12")
      p 總金額 {{ totalPrice }}
      v-btn(color="green" :disabled="!canCheckout" @click="onCheckoutBtnClick") 結帳
</template>

<script setup>
import { reactive, computed } from 'vue'
import Swal from 'sweetalert2'
import { apiAuth } from '@/plugins/axios'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = useUserStore()
const { editCart, checkout } = user

const cart = reactive([])

const updateCart = async (idx, quantity) => {
  await editCart({ _id: cart[idx].p_id._id, quantity })
  cart[idx].quantity += quantity
  if (cart[idx].quantity <= 0) {
    cart.splice(idx, 1)
  }
}

const onCheckoutBtnClick = async () => {
  await checkout()
  router.push('/orders')
}

const totalPrice = computed(() => {
  return cart.reduce((total, current) => {
    return total + (current.p_id.price * current.quantity)
  }, 0)
})

const canCheckout = computed(() => {
  return cart.length > 0 && !cart.some(product => {
    return !product.p_id.sell
  })
});

(async () => {
  try {
    const { data } = await apiAuth.get('/users/cart')
    cart.push(...data.result)
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: '取得購物車失敗'
    })
  }
})()
</script>

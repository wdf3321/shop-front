<template lang="pug">
#orders
  v-row
    v-col(cols="12")
      h1.text-center 訂單
    v-divider
    v-col(cols="12")
      v-table
        thead
          tr
            th ID
            th 日期
            th 金額
            th 商品
        tbody
          tr(v-for="order in orders" :key="order._id")
            td {{ order._id }}
            td {{ new Date(order.date).toLocaleDateString() }}
            td {{ order.totalPrice }}
            td
              ul
                li(v-for="product in order.products" :key="product._id")
                  | {{ product.quantity + ' 個 ' + product.p_id.name }}
</template>

<script setup>
import { reactive } from 'vue'
import { apiAuth } from '@/plugins/axios'
import Swal from 'sweetalert2'

const orders = reactive([]);

(async () => {
  try {
    const { data } = await apiAuth.get('/orders')
    orders.push(...data.result.map(order => {
      order.totalPrice = order.products.reduce((total, current) => total + current.p_id.price * current.quantity, 0)
      return order
    }))
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '失敗',
      text: '取得訂單失敗'
    })
  }
})()
</script>

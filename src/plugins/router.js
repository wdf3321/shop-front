import { createRouter, createWebHashHistory } from 'vue-router'
import FrontLayout from '@/layouts/FrontLayout.vue'
import FrontHomeView from '@/views/front/HomeView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHashHistory(import.meta.BASE_URL),
  routes: [
    {
      path: '/',
      component: FrontLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: FrontHomeView,
          meta: {
            title: '購物網',
            login: false,
            admin: false
          }
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/views/front/RegisterView.vue'),
          meta: {
            title: '購物網 | 註冊',
            login: false,
            admin: false
          }
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/front/LoginView.vue'),
          meta: {
            title: '購物網 | 登入',
            login: false,
            admin: false
          }
        },
        {
          path: 'products/:id',
          name: 'product',
          component: () => import('@/views/front/ProductView.vue'),
          meta: {
            title: '購物網 | 商品',
            login: false,
            admin: false
          }
        },
        {
          path: 'cart',
          name: 'cart',
          component: () => import('@/views/front/CartView.vue'),
          meta: {
            title: '購物網 | 購物車',
            login: true,
            admin: false
          }
        },
        {
          path: 'orders',
          name: 'orders',
          component: () => import('@/views/front/OrdersView.vue'),
          meta: {
            title: '購物網 | 訂單',
            login: true,
            admin: false
          }
        }
      ]
    },
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      children: [
        {
          path: '',
          name: 'admin-home',
          component: () => import('@/views/admin/HomeView.vue'),
          meta: {
            title: '購物網 | 管理',
            login: true,
            admin: true
          }
        },
        {
          path: 'products',
          name: 'admin-products',
          component: () => import('@/views/admin/ProductsView.vue'),
          meta: {
            title: '購物網 | 商品管理',
            login: true,
            admin: true
          }
        },
        {
          path: 'orders',
          name: 'admin-orders',
          component: () => import('@/views/admin/OrdersView.vue'),
          meta: {
            title: '購物網 | 訂單管理',
            login: true,
            admin: true
          }
        }
      ]
    },
    {
      path: '/404',
      name: '404',
      component: NotFoundView,
      meta: {
        title: '購物網 | 404',
        login: false,
        admin: false
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'all',
      redirect: '/404'
    }
  ]
})

router.afterEach((to, from) => {
  document.title = to.meta.title
})

router.beforeEach(async (to, from, next) => {
  const user = useUserStore()
  if (user.isLogin && (to.path === '/register' || to.path === '/login')) {
    next('/')
  } else if (to.meta.login && !user.isLogin) {
    next('/login')
  } else if (to.meta.admin && !user.isAdmin) {
    next('/')
  } else {
    next()
  }
})

export default router

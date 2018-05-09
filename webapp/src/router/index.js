import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '@/views/GoodsList'
import CartList from '@/views/CartList'
import Address from '@/views/Address'
import Order from '@/views/Order'
import Payment from '@/views/Payment'
import PaymentSuccess from '@/views/PaymentSuccess'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path: '/cartList',
      name: 'CartList',
      component: CartList
    },
    {
      path: '/address',
      name: 'Address',
      component: Address
    },
    {
      path: '/order',
      name: 'Order',
      component: Order
    },
    {
      path: '/payment',
      name: 'Payment',
      component: Payment
    },
    {
      path: '/paymentsuc',
      name: 'PaymentSuccess',
      component: PaymentSuccess
    }
  ]
})

<!--商品列表-->
<template>
  <div>
    <div class="bread">
      <el-breadcrumb class="wrap" separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item>order</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="wrap">
      <div class="step">
        <el-steps :active="1" finish-status="success" :align-center=true>
          <el-step title="选择地址"></el-step>
          <el-step title="提价订单"></el-step>
          <el-step title="支付"></el-step>
          <el-step title="支付完成"></el-step>
        </el-steps>
      </div>
      <div class="order">
          <el-table
            :data="cartlist"
            style="width: 100%;">
            <el-table-column label="商品" min-width="300px">
              <template slot-scope="scope">
                <img :src="'../../static/img/'+scope.row.productImg" class="product-img" alt="">
                <span class="product-name">{{scope.row.productName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="商品价格" min-width="160px" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.productPrice|currency('￥')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="商品数量" min-width="160px" align="center">
              <template slot-scope="scope">
                <a href="javascript:;" @click="changeNum('subtract',scope.row)"><i class="icon el-icon-remove-outline"></i></a>
                <span>{{scope.row.productNum}}</span>
                <a href="javascript:;" @click="changeNum('add',scope.row)"><i class="icon el-icon-circle-plus-outline"></i></a>
              </template>
            </el-table-column>

            <el-table-column label="商品总价" min-width="160px" align="center">
              <template slot-scope="scope">
                <span>{{(scope.row.productPrice*scope.row.productNum)|currency('￥')}}</span>
              </template>
            </el-table-column>
          </el-table>
        <div class="more-btn">
          <div class="prev">
            <router-link to="/address">上一步</router-link>
          </div>
          <div class="settlement">
            <p><span>商品价格：</span><span>{{proTotal|currency('￥')}}</span></p>
            <p><span>配送费：</span><span>{{shipping|currency('￥')}}</span></p>
            <p><span><el-checkbox v-model="couponCheck"></el-checkbox>折扣券:</span><span>{{coupon|currency('￥')}}</span></p>
            <p><span>订单总价格：</span><span>{{orderTotal|currency('￥')}}</span></p>
            <el-button type="danger" @click="payMent">去支付</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="es6">
import ajax from '../unti/ajax.js'
import {currency} from '../unti/currency.js'
import router from '../router/index'
export default {
  name: 'Order',
  mounted () {
    this.getCartList()
  },
  router,
  data () {
    return {
      checkList: [],
      cartlist: [],
      proTotal: 0,
      shipping: 10,
      couponCheck: true
    }
  },
  methods: {
    getCartList () {
      ajax.getCartList({}, response => {
        if (response.code === 200) {
          let cartList = response.data
          cartList.forEach(item => {
            if (item.checked) {
              this.cartlist.push(item)
            }
          })
          this.totalNum()
        }
      })
    },
    changeNum (type, item) {
      if (type === 'add') {
        // 增加数量
        item.productNum = (item.productNum - 0) + 1
      } else if (type === 'subtract') {
        // 减少数量
        item.productNum = (item.productNum - 0) - 1
        if (item.productNum < 1) {
          item.productNum = 1
          return
        }
      }
      let modifyData = {
        productId: item.productId,
        number: item.productNum
      }
      ajax.modifyNum(modifyData, res => {
        this.totalNum()
      })
    },
    totalNum () { // 计算总数
      let total = 0
      for (let i in this.cartlist) {
        total += (this.cartlist[i].productNum - 0) * (this.cartlist[i].productPrice - 0)
      }
      this.proTotal = total
    },
    payMent () {
      let payData = {
        addressId: this.$route.query.addressId,
        orderTotal: this.orderTotal,
        shipping: this.shipping,
        coupon: this.coupon
      }
      ajax.payMent(payData, res => {
        if (res.code === 200) {
          this.getCartCount()
          router.push({path: '/payment', query: {orderId: res.data.orderId}})
        }
      })
    },
    getCartCount () {
      ajax.getCartCount({}, res => {
        if (res.code === 200) {
          this.$store.commit('initCartCount', res.count)
        }
      })
    }
  },
  computed: {
    coupon () {
      return this.couponCheck ? 30 : 0
    },
    orderTotal () {
      return this.proTotal + this.shipping - this.coupon
    }
  },
  filters: {
    currency
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .order{
    margin:30px 0;
    .icon{
      color: #666;
      magin:0 12px;
      font-size: 16px;
    }
    .product-img{
      width: 80px;
      height: 80px;
      float: left;
    }
    .product-name{
      float: left;
      line-height: 80px
    }
    .settlement{
      display: flex;
      justify-content: center;
      align-items: flex-end;
      flex-direction: column;
      padding:50px 20px;
      p {
        span{
          display: inline-block;
          text-align: end;
          width: 90px;
        }
      }
      button{
        margin:15px 0;
      }
    }
    .el-table {
      border: 1px solid #e2e2e2;
    }
    .prev{
      margin: 20px;
    }
  }
</style>

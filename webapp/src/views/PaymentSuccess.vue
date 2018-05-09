<!--商品列表-->
<template>
  <div>
    <div class="bread">
      <el-breadcrumb class="wrap" separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item>payment</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="wrap">
      <div class="step">
        <el-steps :active="4" finish-status="success" :align-center=true>
          <el-step title="选择地址"></el-step>
          <el-step title="提交订单"></el-step>
          <el-step title="支付"></el-step>
          <el-step title="支付完成"></el-step>
        </el-steps>
      </div>
      <div class="payment">
        <p class="message"><i class="el-icon-success"></i>支付成功！</p>
        <div class="orderInfo">
          <span>订单号：{{orderId}}</span>
          <span>订单价格：￥{{orderTotal}}</span>
        </div>
        <div class="btn">
          <router-link to="/" class="el-button el-button--success is-plain">返回商城</router-link>
          <router-link to="/cartList" class="el-button el-button--success is-plain">返回购物车</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="es6">
import ajax from '../unti/ajax.js'
export default {
  name: 'Address',
  mounted () {
    this.getOrder()
  },
  data () {
    return {
      orderId: '',
      orderTotal: ''
    }
  },
  methods: {
    getOrder () {
      let order = {
        orderId: this.$route.query.orderId
      }
      ajax.getOrder(order, res => {
        if (res.code === 200) {
          this.orderId = res.data.orderId
          this.orderTotal = res.data.orderTotal
        }
      })
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .wrap{
    padding-bottom: 50px;
  }
  .payment{
    padding: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .message{
      align-items: center;
      display: flex;
      font-size: 20px;
      .el-icon-success{
        font-size: 30px;
        margin-right: 10px;
        color: #67C23A;
      }
    }
    .orderInfo{
      width: 40%;
      margin: 30px 0;
      display: flex;
      justify-content: space-between;
    }
    .btn{
      display: flex;
      justify-content: space-between;
    }
  }
  .next{
    display: flex;
    justify-content: flex-end;
  }
</style>

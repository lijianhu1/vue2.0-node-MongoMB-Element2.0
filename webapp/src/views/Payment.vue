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
        <el-steps :active="2" finish-status="success" :align-center=true>
          <el-step title="选择地址"></el-step>
          <el-step title="提交订单"></el-step>
          <el-step title="支付"></el-step>
          <el-step title="支付完成"></el-step>
        </el-steps>
      </div>
      <div class="payment">
        <div class="pay-img">
          <h3>扫码添加微信号</h3>
          <img src="../../static/qrcode.png" alt="">
        </div>
      </div>
      <div class="next">
        <el-button type="danger" @click="next()">下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script type="es6">
import router from '../router/index'
export default {
  name: 'Address',
  mounted () {
  },
  router,
  data () {
    return {
    }
  },
  methods: {
    next () {
      let orderId = this.$route.query.orderId
      router.push({
        path: '/paymentsuc',
        query: {
          orderId
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
    .pay-img{
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      h3{
        margin-bottom:20px;
      }
      img{
        width: 200px;
        height: 200px;
      }
    }
  }
  .next{
    display: flex;
    justify-content: flex-end;
  }
</style>

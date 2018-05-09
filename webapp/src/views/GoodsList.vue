<!--商品列表-->
<template>
  <div>
    <div class="bread">
      <el-breadcrumb class="wrap" separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item>GoodsList</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="wrap">
      <div class="sort-top">
        <div class="sort-item">
          排序：
          <el-button type="text" @click="init" :class="{'active':!sortType}">默认</el-button>
          <el-button type="text" @click="sort" :class="{'active':sortType}">价格 <i :class="this.sortFlag?'el-icon-arrow-up':'el-icon-arrow-down'"></i></el-button>
        </div>
      </div>
      <div class="wrap content">
        <div class="nav-left">
          <strong>价格范围</strong>
          <ul>
            <li> <el-button :class="goods.priceLevel==-1?'active':''" @click="level(-1)" type="text">all</el-button></li>
            <li> <el-button :class="goods.priceLevel==0?'active':''" @click="level(0)" type="text">0.00-100.00</el-button></li>
            <li> <el-button :class="goods.priceLevel==1?'active':''" @click="level(1)" type="text">100.00-500.00</el-button></li>
            <li> <el-button :class="goods.priceLevel==2?'active':''" @click="level(2)" type="text">500.00-1000.00</el-button></li>
            <li> <el-button :class="goods.priceLevel==3?'active':''" @click="level(3)" type="text">1000.00-2000.00</el-button></li>
            <li> <el-button :class="goods.priceLevel==4?'active':''" @click="level(4)" type="text">2000.00-6000.00</el-button></li>
          </ul>
        </div>
        <div class="content-right">
          <ul>
            <li v-for="(item,index) in list" :key='index'>
              <img v-lazy="'../../static/img/'+item.productImg" alt="">
              <p class="li-font-bold">{{item.productName}}</p>
              <p class="li-color-red">￥{{item.productPrice}}</p>
              <el-button @click="addCart(item.productId)">加入购物车</el-button>
            </li>
          </ul>
          <div class="view-more-normal"
               v-infinite-scroll="loadMore"
               infinite-scroll-disabled="busy"
               infinite-scroll-distance="30">
          </div>
        </div>

      </div>
    </div>
    <el-dialog
      title="提示"
      custom-class="addCartDialog"
      :visible.sync="addCartDialog"
      width="30%">
      <p class="dialogText"><i class="el-icon-success"></i> 已成功加入购物车</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCartDialog = false">继 续 购 物</el-button>
        <!-- <el-button type="danger" @click="addCartDialog = false">查 看 购 物 车</el-button> -->
        <a href="/#/cartList" class="el-button el-button--danger">查 看 购 物 车</a>
      </span>
    </el-dialog>
  </div>

</template>

<script type="es6">
import ajax from '../unti/ajax.js'
export default {
  name: 'GoodsList',
  mounted () {
    this.getGoodsList()
  },
  data () {
    return {
      userId: '1',
      list: [],
      goods: {
        page: 1,
        pageSize: 8,
        priceLevel: -1,
        sort: 1
      },
      sortFlag: false,
      sortType: false,
      busy: true,
      loading: false,
      addCartDialog: false
    }
  },
  methods: {
    getGoodsList (flag) {
      var that = this
      that.loading = true
      ajax.getGoodList(that.goods, function (response) {
        if (response.code === 200) {
          if (flag) {
            that.list = that.list.concat(response.data.list)
            if (response.data.count === 0) {
              that.busy = true
            } else {
              that.busy = false
            }
          } else {
            that.list = response.data.list
            that.busy = false
          }
          that.loading = false
        }
      })
    },
    level (val) {
      this.goods.page = 1
      this.goods.priceLevel = val
      this.getGoodsList()
    },
    sort () {
      this.goods.page = 1
      this.sortType = true
      this.sortFlag = !this.sortFlag
      this.goods.sort = this.sortFlag ? -1 : 1
      this.getGoodsList()
    },
    init () {
      this.sortType = false
      this.goods = {
        page: 1,
        pageSize: 8,
        priceLevel: -1,
        sort: 1
      }
      this.getGoodsList()
    },
    loadMore () {
      this.busy = true
      var that = this
      setTimeout(() => {
        that.goods.page++
        that.getGoodsList(true)
      }, 500)
    },
    addCart (id) {
      var vm = this
      var data = {
        userId: vm.userId,
        productId: id
      }
      ajax.addcart(data, response => {
        if (response.code === 200) {
          vm.addCartDialog = true
          vm.$store.commit('updateCartCount', 1)
        }
      })
    }
  }

}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .sort-top{
    height: 45px;
    line-height: 45px;
    .sort-item{
      display: flex;
      justify-content: flex-end;
      .active{
        color: #d1434a;
      }
    }
  }
  .content{
    display: flex;
    .nav-left{
      width: 200px;
      flex-shrink:0;
      margin-right:20px;
      margin-top: 30px;
      strong{
        font-size: 16px;
      }
      ul{
        margin-top: 20px;
        li{
          height: 26px;
          line-height: 26px;
          margin:10px 0;
          .el-button--text{
            font-size: 16px;
            padding:6px;
          }
          transition: .3s;
          .active{
            border-left: 3px solid #d1434a;
            border-radius: 0;
            padding-left:20px;
            color: #d1434a;
            transition: .3s;
          }

        }
      }
    }
    .content-right{
      ul{
        display: flex;
        flex-wrap: wrap;
        li{
          padding:10px;
          width: 240px;
          margin:20px 10px;
          border: 2px solid #e9e9e9;
          background: #fff;
          transition: .5s;
          &:hover{
            border-color: #409EFF;
            transform: translateY(-5px);
            transition: .5s;
          }
          img{
            width: 100%;
          }
          p{
            margin:10px 0;
            text-indent: 10px;
          }
          button{
            width: 100%;
          }
        }
      }
      .view-more-normal{
        text-align: center;
      }
    }
  }
  .addCartDialog{
    .dialogText{
      text-align: center;
      font-size: 20px;
      .el-icon-success{
        color: #67C23A;
        margin-right: 20px;
      }
    }
    .dialog-footer{
      display: flex;
      justify-content: center;
      .el-button{
        width: 30%;
        margin:0 20px 20px;
      }
    }
  }
</style>

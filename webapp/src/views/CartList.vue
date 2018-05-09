<!--商品列表-->
<template>
  <div>
    <div class="bread">
      <el-breadcrumb class="wrap" separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item>cartList</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="wrap">
      <el-checkbox-group v-model="checkList" @change="cartListChange">
        <el-table
        :data="cartlist"
        style="width: 100%">
          <el-table-column  width="30px">
            <template slot-scope="scope">
              <el-checkbox size="small" :label="scope.row"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="商品" min-width="300px">
            <template slot-scope="scope">
              <img :src="'../../static/img/'+scope.row.productImg" class="product-img" alt="">
              <span class="product-name">{{scope.row.productName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品价格" min-width="160px" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.productPrice}}</span>
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
              <span>{{scope.row.productPrice*scope.row.productNum}}</span>
            </template>
          </el-table-column>
          <el-table-column label="删除" min-width="160px" align="center">
            <template slot-scope="scope">
              <a href="javascript:;" @click="deleteBtn(scope.row.productId)"><i class="icon el-icon-delete"></i></a>
            </template>
          </el-table-column>
        </el-table>
    </el-checkbox-group>
      <div class="more-btn" v-if="cartlist.length>0">
        <div>
          <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-button size="mini" :disabled="checkList.length === 0" @click = "batchDel">删除</el-button>
        </div>
        <span class="settlement">
          <span>总价格：{{total}}</span>
          <el-button type="danger" :disabled="checkList.length === 0" @click="subCart">提交订单</el-button>
        </span>
      </div>
  </div>
  <el-dialog
      title="提示"
      custom-class="delDialog"
      :visible.sync="delDialog"
      width="30%">
      <p class="dialogText"><i class="el-icon-warning"></i> 确定要删除该商品？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialog = false">取 消</el-button>
        <el-button type="danger" @click="deleteSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="es6">
import ajax from '../unti/ajax.js'
import router from '../router/index'
import _ from 'lodash'
export default {
  name: 'CartList',
  router,
  mounted () {
    this.getCartList()
  },
  data () {
    return {
      checkList: [],
      cartlist: [],
      checkAll: false,
      delDialog: false,
      deleteId: ''
    }
  },
  methods: {
    cartListChange (val) {
      this.checkAll = val.length === this.cartlist.length
    },
    handleCheckAllChange (val) {
      this.checkList = val ? this.cartlist : []
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
        let num = 1
        if (type === 'subtract') {
          num = -1
        }
        this.$store.commit('updateCartCount', num)
        this.totalNum()
      })
    },
    deleteBtn (id) {
      this.deleteId = id
      this.delDialog = true
    },
    getCartList () {
      ajax.getCartList({}, response => {
        if (response.code === 200) {
          this.cartlist = response.data
          this.checkList = []
          this.cartlist.forEach(item => {
            if (item.checked) {
              this.checkList.push(item)
            }
          })
          this.checkAll = this.cartlist.length === this.checkList.length
          this.totalNum()
        }
      })
    },
    deleteSubmit () {
      let deleteData = {
        id: this.deleteId
      }
      ajax.deleteGoods(deleteData, response => {
        if (response.code === 200) {
          this.getCartList()
          this.delDialog = false
          this.$message.success('商品已删除')
          this.getCartCount()
        }
      })
    },
    batchDel () { // 批量删除
      if (this.checkList.length === 0) return this.$message.error('请选择商品')
      this.delDialog = true
      let deleteId = []
      for (let i in this.checkList) {
        deleteId.push(this.checkList[i].productId)
      }
      this.deleteId = deleteId.join(',')
    },
    subCart () {
      let ids = (_.map(this.checkList, 'productId')).join(',')
      let checkedId = {
        ids: ids
      }
      ajax.checkedGoods(checkedId, res => {
        if (res.code === 200) {
          router.push({ path: 'address' })
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
    total () {
      let _total = 0
      for (let i in this.checkList) {
        _total += (this.checkList[i].productPrice - 0) * this.checkList[i].productNum
      }
      return _total
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .el-table {
    border: 1px solid #e2e2e2;
  }
  .icon{
   color: #666;
   magin:0 12px;
   font-size: 16px
  }
  .product-img{
    width: 160px;
    height: 160px;
    float: left;
  }
  .product-name{
    float: left;
    line-height: 160px
  }
  .more-btn{
    padding:10px 20px;
    background: #F2F2F2;
    border: 1px solid #e1e1e1;
    border-top: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom:100px;
    button{
      margin: 0 10px;
    }
    .settlement{
      float: right;
    }
  }
  .delDialog{
    .dialogText{
      text-align: center;
      font-size: 20px;
      .el-icon-warning{
        color: #E6A23C;
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

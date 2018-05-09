<!--商品列表-->
<template>
  <div>
    <div class="bread">
      <el-breadcrumb class="wrap" separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item>address</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="wrap">
      <div class="step">
        <el-steps :active="0" finish-status="success" :align-center=true>
          <el-step title="选择地址"></el-step>
          <el-step title="提交订单"></el-step>
          <el-step title="支付"></el-step>
          <el-step title="支付完成"></el-step>
        </el-steps>
      </div>
      <p class="list-title">收货地址 <el-button type="text" @click="moreList = !moreList">{{moreList?'收起地址':'展开全部地址'}}</el-button></p>
      <div class="address-list">
        <div class="address-item" v-for="(item, index) in addressLimit" :key="index" :class="(active._id==item._id)?'active':''" @click="active=item">
          <el-button type="text" icon="el-icon-edit" class="address-edit" @click="editForm(item)"></el-button>
          <strong>{{item.name}}</strong>
          <div class="address-con">
            <p>{{item.city}}</p>
            <p>{{item.address}}</p>
          </div>
          <span>{{item.telphone}}</span>
          <div class="operation">
            <span class="default-addr" v-if="item.isDefault">默认收货地址</span>
            <el-button type="text" v-if="!item.isDefault" @click="defaultAddr(item._id)">设为默认地址</el-button>
            <el-button class="icon-delete" type="text" icon="el-icon-delete" @click="delDiaShow(item._id)"></el-button>
          </div>
        </div>
        <div class="address-item address-add" @click="addDialog = true;addressForm.editType=0">
          <i class="el-icon-plus"></i>
          <p>添加新的地址</p>
        </div>
      </div>
      <div v-if="active._id">
        <p class="list-title">已选收货地址</p>
        <div class="address-list">
          <div class="address-item active">
            <strong>{{active.name}}</strong>
            <div class="address-con">
              <p>{{active.city}}</p>
              <p>{{active.address}}</p>
            </div>
            <span>{{active.telphone}}</span>
          </div>
        </div>
      </div>
      <div class="prev">
        <router-link to="/cartList">上一步</router-link>
      </div>
      <div class="next">
        <el-button type="danger" @click="next()" :disabled="!active._id">下一步</el-button>
      </div>
    </div>
    <el-dialog
      title="添加收货地址"
      :visible.sync="addDialog"
      width="570px"
      custom-class="addDialog">
      <el-form :model="addressForm" :rules="addressRules" ref="addressForm" label-width="100px" class="address-form">
        <el-form-item label="收件人姓名" prop="name">
          <el-input v-model="addressForm.name"></el-input>
        </el-form-item>
        <el-form-item label="收件城市" prop="citySelect">
          <el-cascader
            :options="cityOptions"
            v-model="addressForm.citySelect"
            :props="cityOptionsProps"
            :change-on-select = "true"
            :clearable="true"
            class="cityChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="收件地址" prop="address">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="输入详细地址"
            v-model="addressForm.address">
          </el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="telphone">
          <el-input v-model="addressForm.telphone"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="addressForm.isDefault">设为默认地址</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">提交</el-button>
          <el-button @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="提示"
      custom-class="delDialog"
      :visible.sync="delDialog"
      width="30%">
      <p class="dialogText"><i class="el-icon-warning"></i> 确定要删除该收货地址？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialog = false">取 消</el-button>
        <el-button type="danger" @click="deleteSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="es6">
import ajax from '../unti/ajax.js'
import info from '../unti/info'
import tool from '../unti/tool'
import router from '../router/index'
import _ from 'lodash'
export default {
  name: 'Address',
  router,
  mounted () {
    this.getAddressList()
  },
  data () {
    return {
      addressList: [],
      addDialog: false,
      delDialog: false,
      operationId: '',
      moreList: false,
      active: {},
      addressForm: {
        name: '',
        citySelect: [],
        city: '',
        address: '',
        telphone: '15889950967',
        isDefault: false,
        editType: 0
      },
      addressRules: {
        name: [
          { required: true, message: '收件人姓名', trigger: 'blur' },
          { min: 2, message: '至少2个字符', trigger: 'blur' }
        ],
        citySelect: [
          { required: true, message: '请选择收件城市', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入收件地址', trigger: 'blur' }
        ],
        telphone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          {validator: (rule, value, callback) => {
            let state = tool.verifyMobile(value)
            if (!state.flag) {
              callback(new Error(state.message))
            } else {
              callback()
            }
          },
          trigger: 'blur'}
        ]
      },
      cityOptions: info.getCityList(),
      cityOptionsProps: {
        value: 'value',
        children: 'childList',
        label: 'value'
      }
    }
  },
  methods: {
    getAddressList () {
      ajax.addressList({}, res => {
        if (res.code === 200) {
          this.addressList = res.data
          let defaultAddr = (_.filter(this.addressList, { isDefault: true }))
          if (defaultAddr.length > 0) {
            this.active = defaultAddr[0]
          }
        }
      })
    },
    // 添加收货地址
    submitForm () {
      this.$refs.addressForm.validate((valid) => {
        if (valid) {
          this.addressForm.city = this.addressForm.citySelect.join('-')
          if (!this.addressForm.editType) {
            delete this.addressForm._id
            ajax.addAddress(this.addressForm, res => {
              if (res.code === 200) {
                this.$message.success('地址添加成功')
                this.addDialog = false
                this.getAddressList()
              }
            })
          } else {
            ajax.editAddress(this.addressForm, res => {
              if (res.code === 200) {
                this.$message.success('地址修改成功')
                this.addDialog = false
                this.getAddressList()
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm () {
      this.addressForm = {
        name: '',
        citySelect: [],
        city: '',
        address: '',
        telphone: '',
        isDefault: false
      }
    },
    defaultAddr (id) {
      ajax.defaultAddr({id: id}, res => {
        if (res.code === 200) {
          for (let i in this.addressList) {
            if (id === this.addressList[i]._id) {
              this.addressList[i].isDefault = true
            } else {
              this.addressList[i].isDefault = false
            }
          }
        }
      })
    },
    delDiaShow (id) {
      this.operationId = id
      this.delDialog = true
    },
    deleteSubmit () {
      let delId = {
        id: this.operationId
      }
      ajax.deleteAddr(delId, res => {
        if (res.code === 200) {
          this.getAddressList()
          this.$message.success('删除成功')
          this.delDialog = false
        }
      })
    },
    editForm (item) {
      this.addDialog = true
      this.addressForm = _.clone(item, true)
      this.addressForm.editType = 1
      this.addressForm.citySelect = item.city.split('-')
    },
    next () {
      router.push({path: '/order', query: {addressId: this.active._id}})
    }
  },
  computed: {
    addressLimit () {
      let limit = this.moreList ? this.addressList.length : 3
      return this.addressList.slice(0, limit)
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .list-title{
    color: #d1434a;
    font-size: 20px;
    margin: 20px;
  }
  .address-list{
    display: flex;
    flex-wrap: wrap;
    .address-item{
      width: 300px;
      height: 170px;
      padding:20px;
      align-items: center;
      border: 2px solid #D1CCCF;
      margin-right: 20px;
      margin-bottom:20px;
      cursor: pointer;
      .address-edit{
        float: right;
        padding:0;
        color: #d1434a;
      }
      &:hover,&.active{
        border-color: #e34c57;
      }
      &.address-add{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .el-icon-plus{
          font-size: 30px;
        }
        &:hover{
          color: #d1434a;
          cursor: pointer;
        }
      }
      .address-con{
        margin:10px 0;
      }
      .operation{
        overflow: hidden;
        .default-addr{
          line-height: 40px;
        }
        button{
          color: #d1434a;
          float: left;
          &.icon-delete{
            float: right;
          }
        }
      }
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
  .addDialog{
    .address-form{
      width: 510px;
    }
    .cityChange{
      width: 410px;
    }
  }
  .next{
    display: flex;
    justify-content: flex-end;
    padding:30px;
  }
</style>

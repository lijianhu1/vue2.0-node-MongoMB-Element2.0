<template>
  <header>
    <div class="wrap">
      <div class="logo">
        <img src="../assets/logo.png" alt="">
      </div>
      <div class="user">
      <el-button type="text">{{userinfo.userName}}</el-button>
        <a href="javascript:;" @click="dialogLogin = true" v-if="!userinfo.islogin">login</a>
        <a href="javascript:;" @click="logout" v-else>logout</a>
        <el-badge :value="totalCount" class="item">
          <a href="/#/cartList" class="el-icon-goods"></a>
        </el-badge>
      </div>
    </div>
    <el-dialog
      title="用户登录"
      :visible.sync="dialogLogin"
      width="30%"
      custom-class="login">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" @change="error=''"></el-input>
        </el-form-item>
        <el-form-item label="用户密码">
          <el-input type="password" v-model="form.password" @change="error=''"></el-input>
        </el-form-item>
         <el-form-item>
          <div class="red">{{error}}</div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="dialogLogin = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </header>
</template>
<script>
import ajax from '../unti/ajax.js'
export default {
  name: 'navHeader',
  mounted () {
    this.$nextTick(function () {
      this.getUserinfo()
      this.getCartCount()
    })
  },
  data () {
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      dialogLogin: false,
      userinfo: {
        islogin: false,
        userName: ''
      },
      error: ''
    }
  },
  methods: {
    open () {
      this.dialogLogin = true
    },
    login () {
      let that = this
      ajax.login(that.form, response => {
        if (response.code === 200) {
          that.$message.success('登录成功')
          that.dialogLogin = false
          that.getUserinfo()
        } else {
          that.error = response.message
        }
      })
    },
    getUserinfo () {
      ajax.userinfo({}, res => {
        if (res.code === 200) {
          this.userinfo = res.data
        }
      })
    },
    logout () {
      ajax.logout({}, res => {
        if (res.code === 200) {
          this.$message.success('退出成功!')
          this.userinfo.islogin = false
          this.userinfo.userName = ''
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
    totalCount () {
      return this.$store.state.cart.cartCount
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
  header {
    height: 80px;
    background: #fff;
    .wrap{
      display: flex;
      justify-content: space-between;
    }
    img {
      height: 80px;
    }
    .user {
      padding-top:20px;
      a {
        margin: 0 10px;
        color: #666;
        &.el-icon-goods{
          font-size: 20px;
        }
      }
    }
    .login{
      .el-form-item{
        margin-bottom: 10px
      }
      .red{
        color: red;
      }

    }
  }

</style>

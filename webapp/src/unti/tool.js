import axios from 'axios'
import app from '../main'
import $ from 'jquery'
let tool = {
  ajax (url, method, data, successFun, failFun, loading) {
    // if(!loading){}
    let ajaxAxios
    if (method === 'get') {
      ajaxAxios = axios.get(url, {params: data})
    } else {
      ajaxAxios = axios.post(url, data)
    }
    ajaxAxios.then(res => {
      if (typeof successFun === 'function') {
        if (res.data.code === 401) {
          // 未登录
          let appRoot = app.$children[0]
          appRoot.$refs.navHead.dialogLogin = true
        } else {
          successFun(res.data)
        }
      }
    }).catch(err => {
      if (typeof failFun === 'function') {
        failFun(err)
      }
    })
  },
  //验证手机号
  verifyMobile (value) {
    value = $.trim(value);
    if(!value) {
      return {
        flag: false,
        message: '手机号不能为空'
      };
    } else if(/^[1][34578]\d{9}$/.test(value)) {
      return {
        flag: true,
        message: '验证成功'
      };
    } else {
      return {
        flag: false,
        message: '手机号格式不正确'
      };
    }
  }
}
export default tool

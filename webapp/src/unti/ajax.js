import tool from './tool'

let ajaxData = {
  // /*用户登录*/
  login (data, successFun, failFun) {
    tool.ajax('/user/login', 'post', data, successFun, failFun)
  },
  // /*商品列表*/
  getGoodList (data, successFun, failFun) {
    tool.ajax('/goods/list', 'get', data, successFun, failFun)
  },
  // /*商品列表*/
  addcart (data, successFun, failFun) {
    tool.ajax('/goods/addcart', 'post', data, successFun, failFun)
  },
  // /*获取用户信息*/
  userinfo (data, successFun, failFun) {
    tool.ajax('/user/userinfo', 'get', data, successFun, failFun)
  },
  // 退出
  logout (data, successFun, failFun) {
    tool.ajax('/user/logout', 'get', data, successFun, failFun)
  },
  // 获取购物车列表
  getCartList (data, successFun, failFun) {
    tool.ajax('/goods/cartList', 'get', data, successFun, failFun)
  },
  // 修改商品数量
  modifyNum (data, successFun, failFun) {
    tool.ajax('/goods/modifyNum', 'get', data, successFun, failFun)
  },
  // 删除商品
  deleteGoods (data, successFun, failFun) {
    tool.ajax('/goods/deleteGoods', 'post', data, successFun, failFun)
  },
  // 修改商品是否选中
  checkedGoods (data, successFun, failFun) {
    tool.ajax('/goods/checkedGoods', 'post', data, successFun, failFun)
  },
  // 获取收货地址
  addressList (data, successFun, failFun) {
    tool.ajax('/user/addressList', 'get', data, successFun, failFun)
  },
  // 添加收货地址
  addAddress (data, successFun, failFun) {
    tool.ajax('/user/addAddress', 'post', data, successFun, failFun)
  },
  // 编辑收货地址
  editAddress (data, successFun, failFun) {
    tool.ajax('/user/editAddress', 'post', data, successFun, failFun)
  },
  // 设置为收货地址
  defaultAddr (data, successFun, failFun) {
    tool.ajax('/user/defaultAddr', 'get', data, successFun, failFun)
  },
  // 删除收货地址
  deleteAddr (data, successFun, failFun) {
    tool.ajax('/user/deleteAddr', 'get', data, successFun, failFun)
  },
  // 去支付
  payMent (data, successFun, failFun) {
    tool.ajax('/user/payMent', 'post', data, successFun, failFun)
  },
  // 获取订单
  getOrder (data, successFun, failFun) {
    tool.ajax('/user/getOrder', 'get', data, successFun, failFun)
  },
  // 商品数量
  getCartCount (data, successFun, failFun) {
    tool.ajax('/user/getCartCount', 'get', data, successFun, failFun)
  }
}
export default ajaxData

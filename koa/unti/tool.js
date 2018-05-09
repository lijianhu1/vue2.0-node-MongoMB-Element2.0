let tool = {
  //验证手机号
  verifyMobile (value) {
    // value = value.trim();
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
};
module.exports = tool;
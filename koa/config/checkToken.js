const jwt = require('jsonwebtoken');
module.exports = function () {
  return async (ctx,next)=>{
      const token = ctx.cookies.get('token');
      const userName = ctx.cookies.get('userName');
      let decoded = jwt.decode(token, 'lijianhui');
      if(token&&decoded.name==userName){
          if(decoded.exp <= new Date()/1000 && !(ctx.originalUrl=='/user/login' || ctx.originalUrl=='/user/logout' || ctx.originalUrl.indexOf('/goods/list')>-1)) {
              ctx.status = 200;
              ctx.body = {
                  code:401,
                  message: '登录已过期，请重新登录！'
              };
          }else {
              await next()
          }
      }else {
          if(ctx.originalUrl=='/user/login' || ctx.originalUrl=='/user/logout' || ctx.originalUrl.indexOf('/goods/list')>-1){
              await next();
          }else{
              ctx.status = 200;
              ctx.body={
                  code:401,
                  message:'当前未登录！',
              };
          }
      }
  }
};
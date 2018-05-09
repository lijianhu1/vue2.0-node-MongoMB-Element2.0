const router = require('koa-router')();
const Users = require('../model/users');
const tool = require('../unti/tool');
router.prefix('/user');
const jwt = require('jsonwebtoken');
require('../unti/dateFormat');
router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
}).post('/login',async (ctx,next)=>{

  let login = {
    userName:ctx.request.body.username,
    userPwd:ctx.request.body.password
  };
    const token = jwt.sign({name:login.userName}, 'lijianhui', {expiresIn: '1h'}); //token签名 有效期为1小时
  let user = await Users.findOne(login);
  if(user){
    ctx.cookies.set('userId',user.userId);
    ctx.cookies.set('userName',user.userName);
    ctx.cookies.set('token',token);
    ctx.body={
        code:200,
        message:"登录成功！"
    }
  }else {
    ctx.body={
      code:1,
      message:"帐号密码错误!"
    }
  }
}).get('/userinfo',async(ctx,next)=>{
  let userName = ctx.cookies.get('userName');
  let userInfo = {
    userName:userName
  };
  let user = await Users.findOne(userInfo);
  if(user){
    ctx.body={
        code:200,
        message:"获取成功！",
        data:{
          userName:user.userName,
          userId:user.userId,
          islogin:true
        }
    }
  }else{
    ctx.body={
        code:301,
        message:"获取失败"
    }
  }
}).get('/logout',async(ctx,next)=>{
    ctx.cookies.set('userId','');
    ctx.cookies.set('userName','');
    ctx.cookies.set('token','');
    ctx.body={
        code:200,
        message:"退出成功"
    }
}).get('/addressList', async ctx =>{
  let reqData = {
    userName: ctx.cookies.get('userName')
  };
  let user = await Users.findOne(reqData).lean().exec().catch(err => {
    ctx.throw(500, '服务器错误')
  });//查询当前用户
  let addressList = user.addressList;
  ctx.body = {
    code: 200,
    data: addressList,
    message: 'success'
  };
}).post('/addAddress', async ctx => {
  try {
    let reqData = {
      userName: ctx.cookies.get('userName')
    };
    let address={
      name:ctx.request.body.name,
      city:ctx.request.body.city,
      address:ctx.request.body.address,
      telphone:ctx.request.body.telphone,
      isDefault:ctx.request.body.isDefault,
    };
    if(!address.name||!address.city||!address.address){
      return ctx.body={
        code:301,
        message:'数据错误'
      }
    }else if(!tool.verifyMobile(address.telphone).flag){
      return ctx.body={
        code:301,
        message:tool.verifyMobile(address.telphone).message
      }
    }


    let userData = await Users.findOne(reqData);
    let addressList = userData.addressList;
    if(address.isDefault){
      addressList.forEach(item => {
        item.isDefault = false
      })
    }
    addressList.push(address);
    userData.save();
    ctx.body = {
      code: 200,
      message: 'success'
    };
  }catch (err){
    let errorRes = {
      code: 0,
      message: 'error',
      data: err
    };
    return errorRes
  }

}).get('/defaultAddr', async ctx => {
  let id = ctx.query.id;
  if(!id){
    return ctx.body = {
      code:301,
      message:'id不能为空'
    }
  }
  let user = {
    userName:ctx.cookies.get('userName')
  };
  let userData = await Users.findOne(user);//查询当前用户
  if(userData){
    let addressList = userData.addressList;
    addressList.map(item=>{
      if(item.id===id){
        item.isDefault = true
      }else {
        item.isDefault = false
      }
    });
    userData.save();
    ctx.body={
      code:200,
      message:'success'
    }
  }
}).get('/deleteAddr',async ctx => {
  let id = ctx.query.id;
  if(!id){
    return ctx.body = {
      code:301,
      message:'id不能为空'
    }
  }
  let userName= ctx.cookies.get('userName');
  await Users.update({"userName":userName,$pull:{"addressList":{"_id":id}}});
  ctx.body={
    code:200,
    message:'地址已删除'
  }
}).post('/editAddress', async ctx=>{
   let userName= ctx.cookies.get('userName'),
    id = ctx.request.body._id;
  let modify = {
    name: ctx.request.body.name,
    city: ctx.request.body.city,
    address: ctx.request.body.address,
    telphone: ctx.request.body.telphone,
    isDefault: ctx.request.body.isDefault
  };
  if(modify.isDefault){
    // test = await User.update({"userName":userName,"addressList":{"$elemMatch":{"_id":{"$nin":id}}}},{"$set":{"addressList.$.isDefault":false}},{ multi: true }).catch(err=>{
    //   ctx.throw(500,'服务器错误')
    // });
    let userData = await Users.findOne({"userName":userName});
    let addressList = userData.addressList;
    addressList.map(item=>{
      if(item._id!=id){
        item.isDefault = false
      }
    });
    userData.save()
  }
  await Users.update({"userName":userName,"addressList._id":id},{"addressList.$":modify}).catch(err=>{
    ctx.throw(500,'服务器错误')
  });
  // let test = await User.update({userName: userName}, {$set: {'addressList.$[item].isDefault': false}}, {$arrayFilters: [{'item._id': {$ne: id}}]})
  ctx.body={
    code:200,
    message:'更新成功'
  }
}).post('/payMent', async ctx=> {
  let userName = ctx.cookies.get('userName'),
    addressId = ctx.request.body.addressId,
    orderTotal = ctx.request.body.orderTotal,
    shipping = ctx.request.body.shipping,
    coupon = ctx.request.body.coupon,
    goodsList = [],
    addressInfo='';
  let userData = await Users.findOne({userName:userName}).catch(err=>{ctx.throw(500,'服务器错误')});
  userData.cartList.forEach(item=>{
    if(item.checked){
      goodsList.push(item)
    }
  });
  userData.addressList.forEach(item=>{
    if(item._id == addressId){
      addressInfo = item
    }
  });
  //随机生成订单号
  let r1 = Math.floor(Math.random()*10),
    r2 = Math.floor(Math.random()*10),
    platForm = '403',//定义平台码
    sysDate = new Date().Format('yyyyMMddhhmmss'),
    createTime = new Date().Format('yyyy-MM-dd hh:mm:ss'),
    orderId = platForm+r1+sysDate+r2;
  let orderInfo={
    orderId,
    addressInfo,
    goodsList,
    createTime,
    orderTotal,
    shipping,
    coupon,
    orderState:1
  };
  userData.orderList.push(orderInfo);
  userData.save();
  await Users.update({"userName":userName,$pull:{"cartList":{"checked":true}}});//删除购买的商品
  ctx.body = {
    code: 200,
    message: '订单创建成功',
    data:{
      orderId: orderId,
      orderTotal: orderTotal
    }
  }
}).get('/getOrder', async ctx => {
  let userName = ctx.cookies.get('userName'),
    orderId = ctx.query.orderId,
    orderTotal='',
    _orderId='';
  let userData = await Users.findOne({userName:userName});
  let orderList = userData.orderList;
  orderList.map(item => {
    if(item.orderId == orderId){
      _orderId = item.orderId;
      orderTotal = item.orderTotal
    }
  });
  if(!_orderId){
    ctx.body = {
      code:301,
      message: "无此订单"
    }
  }else {
    ctx.body={
      code:200,
      message:'success',
      data:{
        orderId:_orderId,
        orderTotal
      }
    }
  }
}).get('/getCartCount', async ctx => {
  let userName = ctx.cookies.get('userName')
  let userData = await Users.findOne({userName:userName})
  let cartList = userData.cartList;
  let count = 0;
  cartList.map(item => {
    count += (item.productNum-0)
  });
  ctx.body = {
    code: 200,
    message: 'success',
    count
  }
});

module.exports = router;

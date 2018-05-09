const router = require('koa-router')();
const mongoose = require('mongoose');
const Goods = require('../model/goods');
const Users = require('../model/users');
router.prefix('/goods');

//连接MongoDB数据库
mongoose.connection.openUri('mongodb://127.0.0.1:27017/shopping');

mongoose.connection.on("connected", function () {
  console.log("MongoDB connected success.")
});

mongoose.connection.on("error", function () {
  console.log("MongoDB connected fail.")
});

mongoose.connection.on("disconnected", function () {
  console.log("MongoDB connected disconnected.")
});

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
});

router.get('/list', async (ctx, next) => {
  // let goodsModel = await Goods.find({productId:"10018"}, function(err,data){
  //     ctx.body = data
  // });
  let page = parseInt(ctx.query.page);
  let pageSize = parseInt(ctx.query.pageSize);
  let priceLevel = ctx.query.priceLevel;
  let sort = ctx.query.sort;
  let skip = (page - 1) * pageSize;
  var priceGt = '', priceLte = '';
  let params = {};
  if (priceLevel != -1) {
    switch (priceLevel) {
      case '0':
        priceGt = 0;
        priceLte = 100;
        break;
      case '1':
        priceGt = 100;
        priceLte = 500;
        break;
      case '2':
        priceGt = 500;
        priceLte = 1000;
        break;
      case '3':
        priceGt = 1000;
        priceLte = 2000;
        break;
      case '4':
        priceGt = 2000;
        priceLte = 6000;
        break;
    }
    params = {
      productPrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    }
  }
  let goodsListData = await Goods.find(params).skip(skip).limit(pageSize).sort({'productPrice': sort}).exec();
  ctx.body = {
    code: 200,
    data: {
      count: goodsListData.length,
      list: goodsListData
    },
    message: "获取成功"
  }
}).post('/addcart', async (ctx, next) => {  //添加商品
  let productId = ctx.request.body.productId, userId = ctx.request.body.userId;
  let userData = await Users.findOne({userId: userId});

  if (userData) {
    let goodsItem = '';
    //判断是否已有该商品
    userData.cartList.forEach(item => {
      if (item.productId == productId) {
        goodsItem = item;
        item.productNum++;
      }
    });

    if (goodsItem) {
      userData.save();
      ctx.body = {
        code: 200,
        message: "success"
      }
    } else {
      let goods = await Goods.findOne({productId: productId});
      if (goods) {
        goods.checked = true;
        goods.productNum = 1;
        userData.cartList.push(goods);
        userData.save();
        ctx.body = {
          code: 200,
          data: userData,
          message: 'success'
        };
      }

    }
  }

}).get('/cartList', async (ctx, next) => {  //获取购物车列表
  try {
    let reqData = {
      userName: ctx.cookies.get('userName')
    };
  // lean()很重要，关系到能否操作数据，也可添加_doc，如：cartlist._doc.productId  或者test = test.toObject()
    let user = await Users.findOne(reqData).lean().exec().catch(err => {
      ctx.throw(500, '服务器错误')
    });//查询当前用户
    let cartlist = user.cartList; //获取用户的购物车列表
    let productArr=[];
    for (let i=0;i<cartlist.length; i++){
      productArr.push(cartlist[i].productId);
    }
    // let goods = await Goods.find({productId: {'$in':productArr}}).lean().exec().catch(err => {
    //   ctx.throw(500, '服务器错误')
    // });//根据购物车列表id查询对应商品

    let total = 0;
    cartlist.map((cartItem)=> {//跟进id匹配出对应商品价格
      // for(let i in goods){
      //   if(cartItem.productId == goods[i].productId){
      //     cartItem.productPrice = goods[i].productPrice;
      //     cartItem.productImg = goods[i].productImg;
      //   }
      // }
      total  += (cartItem.productPrice-0)*(cartItem.productNum-0);
    });
    ctx.body = {
      code: 200,
      data: cartlist,
      message: 'success',
      total:total
    };
  }catch (err){
    let errorRes = {
      code: 0,
      message: 'error',
      data: err
    };
    return errorRes
  }

}).get('/modifyNum',async ctx=>{
  try {
    let userId = ctx.cookies.get('userId');
    let productId = ctx.query.productId;
    let number = ctx.query.number;
    let numberRegex = new RegExp('^[1-9]\d*$');
    if(!numberRegex.test(number)||!productId){
      return ctx.body={
        code:301,
        message:'参数错误'
      }
    }
    let modify = await Users.update({"userId": userId, "cartList.productId": productId},{"cartList.$.productNum": number});
      ctx.body={
        code:200,
        message:'更新成功'
      }
  }catch (err){
    let errorRes = {
      code: 0,
      message: 'error',
      data: err
    };
    return errorRes
  }
}).post('/deleteGoods', async ctx=>{
  let userId = ctx.cookies.get('userId'),
    productId = ctx.request.body.id;
  if(!productId){
    return ctx.body={
      code:301,
      message:'参数错误'
    }
  }
  let productArr = productId.split(',');
  let deleteGoods = await Users.update({"userId": userId,$pull:{"cartList":{"productId":{'$in':productArr}}}});
  ctx.body={
    code:200,
    message:'更新成功'
  }
}).post('/checkedGoods', async ctx => {
   let userName=ctx.cookies.get('userName'),
    ids = ctx.request.body.ids.split(',');

   let userData = await Users.findOne({"userName":userName});
   let cartlist = userData.cartList;
    cartlist.map(item => {
      item.checked = false;
      for(let i=0;i<ids.length;i++){
        if(ids[i]==item.productId){
          item.checked = true;
          continue;
        }
      }
    });

  userData.save();

  ctx.body = {
    code: 200,
    message: '操作成功',
    test:cartlist
  }
});
// router.get('/list', function (ctx, next) {
//   let goodsModel = Goods.find({productId:"10018"});
//   let responseData;
//   goodsModel.exec((err,data)=>{
//       responseData = data
//   });
//   // console.log(goodsModel)
//     ctx.body='123'
// });

module.exports = router;

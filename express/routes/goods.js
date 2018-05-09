const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const GOODS = require('../models/goods');

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

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('goodlist');
}).get('/list',function (req,res,next) {
    let page = parseInt(req.param("page"));
    let pageSize = parseInt(req.param("pageSize"));
    let priceLevel = req.param("priceLevel");
    let sort = req.param("sort");
    let skip = (page-1)*pageSize;
    var priceGt = '',priceLte = '';
    let params = {};
    if(priceLevel!=-1){
        switch (priceLevel){
            case '0':priceGt = 0;priceLte=100;break;
            case '1':priceGt = 100;priceLte=500;break;
            case '2':priceGt = 500;priceLte=1000;break;
            case '3':priceGt = 1000;priceLte=2000;break;
            case '4':priceGt = 2000;priceLte=6000;break;
        }
        params = {
            productPrice:{
                $gt:priceGt,
                $lte:priceLte
            }
        }
    }
    let goodsModel = GOODS.find(params).skip(skip).limit(pageSize);
    goodsModel.sort({'productPrice':sort});
    goodsModel.exec((err,doc)=>{
        if(err){
            res.json({
                code:1,
                msg:err.message
            });
        }else{
            res.json({
                code:200,
                message:'获取成功',
                data:{
                    count:doc.length,
                    list:doc
                }
            });
        }
    })
}).post('/addcart',(req,res,next)=>{
    const USER = require('../models/user');
    let userId = req.body.userId,productId = req.body.productId;
    USER.findOne({userId:userId},function (err,userData) {
        //查询后回调
        if(err) return next(err);

        if(userData){
            let goodsItem = '';
            userData.cartList.forEach(item=>{
                if(item.productId==productId){
                    goodsItem = item;
                    item.productNum++;
                }
            });
            if (goodsItem){
                userData.save((goodsErr,goodsData)=>{
                    if(goodsErr) return next(goodsErr)
                    res.json({
                        code:200,
                        message:'购物车添加成功'
                    })
                })
            }else {
                GOODS.findOne({productId:productId},(goodsErr,goodsData)=>{
                    if(goodsErr) return next(goodsErr)
                    if(goodsData){
                        goodsData.checked = true;
                        goodsData.productNum = 1;
                        userData.cartList.push(goodsData);
                        userData.save((error,userdata)=>{
                            if(error) return next(error);
                            res.json({
                                code:200,
                                message:'购物车添加成功'
                            })
                        })
                    }
                })
            }
        }

    });

});

module.exports = router;

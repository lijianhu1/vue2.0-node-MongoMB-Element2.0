const express = require('express');
const router = express.Router();
const USER = require('./../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
}).post('/login',(req,res,next)=>{
  let param = {
      userName:req.body.username,
      userPwd:req.body.password
  };
  USER.findOne(param,(err,data) =>{
    if(err) return next(err);
    if(data){
        res.cookie("userId",data.userId,{
            path:'/',
            maxAge:1000*60*60
        });
        res.cookie("userName",data.userName,{
            path:'/',
            maxAge:1000*60*60
        });
        res.json({
            code:200,
            message:"登录成功",
            data:{
                userName:data.userName,
                userId:data.userId
            }
        });
    }
  })

});

module.exports = router;

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    "userId":String,
    "userName":String,
    "userPwd":String,
    "orderList":Array,
    "cartList":[
        {
            "productId":String,
            "productName":String,
            "productPrice":String,
            "productImg":String,
            "checked":Boolean,
            "productNum":String
        }
    ],
    "addressList":[
        {
            "name": String,
            "address": String,
            "city": String,
            "postCode": Number,
            "telphone": Number,
            "isDefault": Boolean,
            "addressId": Number
        }
    ]
});

module.exports = mongoose.model("User",userSchema);

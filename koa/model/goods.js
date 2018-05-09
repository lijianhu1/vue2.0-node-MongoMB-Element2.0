var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var produtSchema = new Schema({
    "productId":{type:String},
    "productName":String,
    "productPrice":Number,
    "checked":String,
    "productNum":Number,
    "productImg":String
});

module.exports = mongoose.model('Good',produtSchema);

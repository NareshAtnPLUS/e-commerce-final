const mongoose = require('mongoose');
const CartSchema = mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    product:{
        type:Object,
        required:true
    }
})
const Cart = module.exports = mongoose.model('Cart',CartSchema);
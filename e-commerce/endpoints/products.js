const express = require('express');
const products = express.Router();
const Mobile = require('../models/mobile')
const User = require('../models/user')
const Cart = require('../models/cart')
const Web3 = require('web3');
const web3 = new Web3('http://127.0.0.1:8545') ;
const supplierAddress = '0xECe154630D91C2fF43Fa0b7Dcf6330eE5c2d35da';
products.get('/getMobiles',(req,res,next)=> {
    Mobile.find({},(err,mobile)=>{
        res.json({
            success:true,
            mobile
        })
    })    
})
products.post('/orderMobile',async (req,res,next) => {
    const variantId = req.body.variant._id;
    const updateAvailable = req.body.variant.available - 1;
    const query = req.body.product;
    const cartQuery = req.body.cartId
    console.log(cartQuery)
    const userName = req.body.userName;
    let price;
    await Mobile.findOne({general:query}).then(mobile => {
        console.log(mobile)
        let variant = mobile.variants.id(variantId);
        variant["available"] = variant["available"] -1;
        price = variant.price.toString()
        
        mobile.save();
    })
    .then((mobile)=>{
        delete req.body.userName
        User.findOne({userName},async (err,user)=>{
            user.ordersPlaced.push(req.body)
            console.log(mobile)
            transactionObject = {
                from:user.etherAccount.address,
                to:supplierAddress,    
                value:web3.utils.toWei(price,'ether')
            }
            
            console.log(transactionObject)
            await web3.eth.sendTransaction(transactionObject,(err,result)=>{
                console.log(result);                
            })
            var updatedBalance = await web3.eth.getBalance(user.etherAccount.address)
            console.log(updatedBalance);
            user.etherAccount.balance = updatedBalance
            user.save()
        })
    })
    .then(()=>{
        if(cartQuery){
            Cart.findByIdAndRemove({_id:cartQuery},(err,data)=>{
                if(err){
                    console.log(err)
                }
            })
        }
    })
    .then(()=>{
        res.json({
            success:true,
            msg:"Product purchased successfully"
        })
    })
    .catch(err => {
        res.json({
            success:false,
            msg:"Product cannot be purchased due to server errors"
        })
        console.log('Error in Updating',err)
    })
})
module.exports = products;
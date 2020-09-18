const express = require('express');
const admin = express.Router();
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const Supplier = require('../models/supplier');
const config = require('../config/database')
const User = require('../models/user');
admin.get('/getSuppliers',(req,res,next)=>{
    Supplier.find({},(err,supplier)=>{
        res.json({
            success:true,
            supplier
        })
    })
})
admin.get('/getUsersOrders',async(req,res,next)=>{
    let orders = []
    await User.find({}).then(users => {
        users.forEach(user => {
            user.ordersPlaced.forEach(order =>{
                orders.push(order)
            })
            
        });
    })
    res.json({
        success:true,
        orders
    })
    
})
admin.post('/register',(req, res, next) => {
    let newUser = new Admin({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        userName:req.body.userName,
        password:req.body.password,
    });
    Admin.addUser(newUser, (err,user) =>{
        if (err){
            res.json({success:false,msg:'Failed to register user'});
        } else {
            res.json({success:true,msg:'Registered user Successfully'});
        }
    });    
});
admin.post('/authenticate',(req, res, next) => {
    const username = req.body.userName;
    const password = req.body.password;
    // console.log(username,'password',password)
    Admin.getUserByUsername(username, (err,user) =>{
        if (err) throw err;
        // console.log(user)
        if (!user) {
            return res.json({success:false,msg:'User not Found'});
        }
        Admin.comparePassword(password, user.password, (err,isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign(user.toJSON(),config.secret,{
                    expiresIn:10 // 1 day in seconds
                });
                res.json({
                    success:true,
                    token:'JWT '+token,
                    user: {
                        id:user._id,
                        name:user.firstName,
                        username:user.username,
                        email:user.email
                    }
                });
            } else {
                return res.json({success:false,msg:'Passwords MisMatched'});
            }
        });
    });
    // console.log(req.user);

});
module.exports = admin;
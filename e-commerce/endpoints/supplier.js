const express = require('express');
const supplier = express.Router();
const Supplier = require('../models/supplier');
const Mobile = require('../models/mobile');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const Web3 = require('web3');
const web3 = new Web3('http://127.0.0.1:8545') ;
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'../uploads');
    },
    filename:function(req,file,cb){
        cb(null,file.filename);
    }
})
const upload = multer({storage:storage});
const config = require('../config/database')
const supplierAddress = '0xECe154630D91C2fF43Fa0b7Dcf6330eE5c2d35da';

supplier.post('/register',async(req, res, next) => {
    console.log(req.body)
    let newUser = new Supplier({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        userName:req.body.userName,
        password:req.body.password,
        address:[req.body.address],
        etherAccount:{
            address:supplierAddress,
            balance:await web3.eth.getBalance(supplierAddress)
        }
    });
    console.log(newUser)
    Supplier.addUser(newUser, (err,user) =>{
        if (err){
            res.json({success:false,msg:'Failed to register user'});
        } else {
            res.json({success:true,msg:'Registered user Successfully'});
        }
    });    
});
supplier.post('/add-product-image',upload.single('file'),(req,res,next) => {
    let file = req.file
    console.log(file.filename);
    if(!file){
        const error = new Error('No File Found');
        error.httpStatusCode = 404
        return next(error);
    }else{
        console.log(file)
    }
    let newProduct = new Mobile(req.body)
    
    
})
supplier.post('/add-product',(req,res,next) => {
    console.log(req.body);
    let newProduct = new Mobile(req.body)
    newProduct
        .save()
        .then(()=>{
            res.json({
                success:true,
                msg:"Product Added Successfully"
            })
        })
        .catch(err =>{
            console.log(err);
        })
})
supplier.post('/authenticate',(req, res, next) => {
    const username = req.body.userName;
    const password = req.body.password;
    // console.log(username,'password',password)
    Supplier.getUserByUsername(username, (err,user) =>{
        if (err) throw err;
        // console.log(user)
        if (!user) {
            return res.json({success:false,msg:'User not Found'});
        }
        Supplier.comparePassword(password, user.password,async (err,isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign(user.toJSON(),config.secret,{
                    expiresIn:10 // 1 day in seconds
                });
                var supplierBalance = await web3.eth.getBalance(user.etherAccount.address)
                res.json({
                    success:true,
                    token:'JWT '+token,
                    user:{
                        id:user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email:user.email,
                        username: user.userName,
                        address:user.address,
                        accountType:"Supplier",
                        address:user.address,
                        balance:web3.utils.fromWei(supplierBalance,'ether'),
                    }
                });
            } else {
                return res.json({success:false,msg:'Passwords MisMatched'});
            }
        });
    });
    // console.log(req.user);

});
module.exports = supplier;
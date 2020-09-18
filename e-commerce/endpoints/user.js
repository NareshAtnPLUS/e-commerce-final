const express = require('express');
const user = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Cart = require('../models/cart');
const Admin = require('../models/admin');
const Supplier = require('../models/supplier');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require('../config/database')
const authenticator = require('otplib').authenticator
const totp = require('otplib').totp
const secret = authenticator.generateSecret();
const Web3 = require('web3');
const accountAddress1 = '0xa106Cac9F8A56e9ac0B0B1a98e6c726Ced15f1ce';
const accountAddress2 = '0x635e9B7435839CA399919D39487e95387fA175Df';
const web3 = new Web3('http://127.0.0.1:8545') ;

user.post('/fetchCart',(req,res,next)=> {
    const query = {userName:req.body.userName}

    Cart.find(query,(err,items)=> {
        if(!err){
            res.json({
                status:true,
                items
            })
        } else {
            res.json({
                status:false,
                items:null
            })
        }
    })
})
user.post('/addToCart',(req,res)=> {
    console.log('Cart',req.body,'cart')
    let newCart = new Cart({
        userName:req.body.userName,
        product:req.body.product
    })
    console.log(newCart)
    newCart
        .save()
        .then(()=>{
            res.json({
                success:true,
                msg:"Product Added to Cart Successfully"
            })
        })
        .catch(err => {
            res.json({
                success:false,
                msg:"Failed to add to cart"
            })
            console.error(err)
        })

})
user.post('/register',async (req, res, next) => {
    let newUser = new User({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        userName:req.body.userName,
        password:req.body.password,
        address:[req.body.address],
        etherAccount:{
            address:accountAddress2,
            balance:await web3.eth.getBalance(accountAddress1)
        }
    });
    console.log(newUser,req.body.address);
    User.addUser(newUser, (err,user) =>{
        if (err){
            res.json({success:false,msg:'Failed to register user'});
        } else {
            res.json({success:true,msg:'Registered user Successfully'});
        }
    
    });    
});

user.post('/check_username',(req,res)=>{
    var [username,accountType] = req.body.username.split('-')

    if(accountType === "User"){
        User.getUserByUsername(username, (err,user) =>{
            if(user){
                // console.log("msg: username already taken");                
                return res.json({
                    success:false,
                    msg:"username already taken"
                })
            } else if(!user){
                // console.log("msg: username available");                
                return res.json({
                    success:true,
                    msg:"username available"
                })
            }
        });
    } else if(accountType === 'Supplier'){
        Supplier.getUserByUsername(username, (err,user) =>{
            if(user){
                // console.log("msg: username already taken");                
                return res.json({
                    success:false,
                    msg:"username already taken"
                })
            } else if(!user){
                // console.log("msg: username available");                
                return res.json({
                    success:true,
                    msg:"username available"
                })
            }
        })
    } else if(accountType === 'Admin'){
        Admin.getUserByUsername(username, (err,user) =>{
            if(user){
                // console.log("msg: username already taken");                
                return res.json({
                    success:false,
                    msg:"username already taken"
                })
            } else if(!user){
                // console.log("msg: username available");                
                return res.json({
                    success:true,
                    msg:"username available"
                })
            }
        })
    }
    
});

user.post('/authenticate',(req, res, next) => {
    const username = req.body.userName;
    const password = req.body.password;
    // console.log(username,'password',password)
    User.getUserByUsername(username, (err,user) =>{
        if (err) throw err;
        // console.log(user)
        if (!user) {
            return res.json({success:false,msg:'User not Found'});
        }
        User.comparePassword(password, user.password, (err,isMatch) => {
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
                        firstName:user.firstName,
                        lastName:user.lastName,
                        username:user.userName,
                        email:user.email,
                        accountType:"User",
                        address:user.address,
                        balance:web3.utils.fromWei(user.etherAccount.balance.toString(),'ether'),
                        ordersPlaced:user.ordersPlaced
                    }
                });
            } else {
                return res.json({success:false,msg:'Passwords MisMatched'});
            }
        });
    });
    // console.log(req.user);

});

user.post('/verify-otp',(req,res,next) => {
    const userName = req.body.userName
    const otp = req.body.otp;
    User.findOne({userName,otp},(err,data)=>{
        if(!err){
            return res.json({
                success:true,
                user:userName,  
                msg:'OTP verification Sucessfull.'
            });
        } else {
            return res.json({success:false,msg:'OTP Verification failed'});
        }
    })
});
user.post('/update-password',(req,res) => {
    const password = req.body.password.password;
    const confirmPassword = req.body.password.confirmPassword;
    if(!userName || password){
        res.json({
            success:false,
            msg:"invalid Request to server"
        })
    }
    User.updatePassword(password,(hashedPassword)=>{
        if(hashedPassword){
            User.findOneAndUpdate({userName},{password:hashedPassword},(err,data)=>{
                if(!err){
                    // console.log(data)
                    res.json({
                        success:true,
                        msg:"Password changed Successfully"
                    })
                } else{
                    res.json({
                        success:false,
                        msg:"Password Updation failed"
                    })
                }
            })
        }
    })
});
user.post('/request-otp',(req, res, next) => {
    const username = req.body.userName;

    User.getUserByUsername(username, (err,user) =>{
        if (err) throw err;
        if (user) {
            const token = totp.generate(secret);
            // console.log(token)
            const isValid = totp.check(token, secret);
            // console.log(isValid)
            const isValidVerify = totp.verify({ token, secret });
            // console.log(isValidVerify)
            // console.log(user.email,user.userName);            
            const mailContent = `
                <p>You have a requested a updation of Password</p>
                <h3>OTP: ${token}</h3>
                <p> OTP is valid only for short time</p>
                `;
            sendEmailToUser(user.email,mailContent,()=>{
                User.findOneAndUpdate({userName:user.userName},{otp:token},(err,data)=>{
                    if (err) throw err;
                    else{
                        // console.log(data);
                        return res.json({
                            success:true,
                            user:user.userName,  
                            token:'User Found,OTP has been sent to your mail.'
                        });
                    }
                })
            })
            // .catch(console.error());
        }else{
            return res.json({success:false,msg:'User not Found'});
        }
    });
    // console.log(req.user);
});
async function sendEmailToUser(email,mailContent,cb) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'testnplus21@gmail.com', // generated ethereal user
        pass: 'nplus12.3' // generated ethereal password
      },
      tls:{
          rejectUnauthorized:false
      }
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Nodemailer contact" <foo@example.com>', // sender address
      to: email, // list of receivers
      subject: "OTP for password Updation ✔", // Subject line
      text: "Hello world?", // plain text body
      html: mailContent // html body
    });
  
    // console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    cb();
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
module.exports = user;
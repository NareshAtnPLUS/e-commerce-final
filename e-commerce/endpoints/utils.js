const User = require('../models/user');
const Admin = require('../models/admin');
const Supplier = require('../models/supplier');

checkusername = function(username,accountType){
    console.log(accountType)
    if(accountType === "User"){
        User.getUserByUsername(username, (err,user) =>{
            if(user){
                console.log("msg: username already taken");                
                return false
            } else if(!user){
                // console.log("msg: username available");                
                return true
            }
        });
    } else if(accountType === 'Supplier'){
        Supplier.getUserByUsername(username, (err,user) =>{
            if(user){
                // console.log("msg: username already taken");                
                return true
            } else if(!user){
                // console.log("msg: username available");                
                return false
            }
        })
    } else if(accountType === 'Admin'){
        Admin.getUserByUsername(username, (err,user) =>{
            if(user){
                // console.log("msg: username already taken");                
                return false
            } else if(!user){
                // console.log("msg: username available");                
                return true
            }
        })
    }
}

module.exports = {
    checkusername
};
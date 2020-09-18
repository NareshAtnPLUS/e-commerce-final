const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const SupplierSchema = mongoose.Schema({
    firstName:{
        type:String,
        require:true
    },
    lastName:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    accountType:{
        type:String,
        require:true
    },
    userName:{
        type:String,
        required:true,
        unique:true,
        index:true
    },
    password:{
        type:String,
        require:true
    },
    otp:{
        type:String,
    },
    address:[{
        doorNo:{
            type:String,
            require:true
        },
        street:{
            type:String,
            require:true
        },
        district:{
            type:String,
            require:true
        },
        state:{
            type:String,
            require:true
        }
    }],
    etherAccount:{
        address:{
            type:String
        },
        balance:{
            type:String
        }
    },
});

const Supplier = module.exports = mongoose.model('Supplier',SupplierSchema);

module.exports.getUserByUsername = function(username,callback){
    const query = {userName:username};
    //console.log(query)
    Supplier.findOne(query,callback);
}
module.exports.getUserById = function(id,callback){
    Supplier.findById(id,callback);
}
module.exports.addUser = function(newUser, callback){
    bcrypt.hash(newUser.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        if(!err){
            newUser.password = hash
            // console.log('schem',newUser)
            newUser.save(callback(null,true));
        }
        else{
            //console.log(err)
        }
    });
    
}
module.exports.updatePassword = function(password,callback){
    bcrypt.hash(password,saltRounds,(err,hash)=>{
        callback(hash)
    })
}
module.exports.comparePassword = function(candidatePassword,hash,callback){
    bcrypt.compare(candidatePassword, hash, function(err, res) {
        // res == true
        callback(null,res);
    });
}
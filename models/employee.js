const mongoose = require('mongoose');

// var Register = mongoose.model('Register', {
//     firstName : String,
//     lastName : String,
//     email : String,
//     phoneNo : String,
//     username : String,
//     password : String,
// })



// module.exports = { Register };
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var schema = new Schema({
    firstName : {type:String, require:true},
    lastName: {type:String, require:true},
    email : {type:String, require:true},
    phoneNo: {type:String, require:true},
    username:{type:String, require:true},
    password:{type:String, require:true}
});

schema.statics.hashPassword = function hashPassword(password){
    console.log("kkkk")
    return bcrypt.hashSync(password,10);
}

schema.methods.isValid = function(hashedpassword){
    console.log("jjjj")
    console.log(hashedpassword)
    console.log(this.password)

    return  bcrypt.compareSync(hashedpassword, this.password);
}
module.exports = mongoose.model('Register',schema);

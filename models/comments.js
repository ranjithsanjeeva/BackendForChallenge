const mongoose = require('mongoose');

var Schema = mongoose.Schema;
// var bcrypt = require('bcrypt');

var schema = new Schema({
    comment : {type:String, required:true},
    postId: {type:String, required:true},
    commentowner : {type:String, required:true},
    date : {type:Date, required:true}
});

// schema.statics.hashPassword = function hashPassword(password){
//     console.log("kkkk")
//     return bcrypt.hashSync(password,10);
// }

// schema.methods.isValid = function(hashedpassword){
//     return  bcrypt.compareSync(hashedpassword, this.password);
// }
module.exports = mongoose.model('Comment',schema);
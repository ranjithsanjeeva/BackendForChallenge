const mongoose = require('mongoose');

var Register = mongoose.model('Register', {
    firstName : String,
    lastName : String,
    email : String,
    phoneNo : String,
    username : String,
    password : String,
})

module.exports = { Register };
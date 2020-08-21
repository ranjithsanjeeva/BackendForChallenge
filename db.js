const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/users',  {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if(!err) {
        console.log("working")
    }
    else {
        console.log("Error in db connection :" + JSON.stringify(err, undefined, 2))
    }
});

module.exports = mongoose;
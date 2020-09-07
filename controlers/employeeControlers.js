const express = require('express');
var router = express.Router();
var objectId = require('mongoose').Types.ObjectId;
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');

var User = require('../models/employee');
var Post = require('../models/posts');
var Comment = require('../models/comments');
var Like = require('../models/likes');
var Share = require('../models/shares');



// router.get('/', (req,resp) => {
//     Register.find((err, docs) => {
//         if(!err) {resp.send(docs); }
//         else { console.log("Error in Employee" + JSON.stringify(err, undefined, 2))}
//     })
// });
router.post('/', [
    check('phoneNo').matches('^\\+(?:[0-9] ?){6,14}[0-9]$').withMessage("error1"),
    check('email').matches('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$').withMessage("error2"),
    check('username').matches('^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$'),
    check('password').isLength({ min: 6 })
  ], (req,resp) => {
    // console.log("king")
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors)
        // return resp.status(422).send(errors.errors[0].msg);
        return resp.status(422).send(`Invalid details please check the details before register`);
    }

    var user = new User({
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        phoneNo : req.body.phoneNo,
        username : req.body.username,
        password : User.hashPassword(req.body.password),
    });
    
    User.findOne(
        {
            username:req.body.username
        }
        ,(err, doc) => {
        if(!err) {
            if(doc) {
                return resp.status(500).send(`Username already taken`)
            }
            else {
                user.save((err, docs) => {
                    if(!err) {resp.send({}); }
                    else { console.log("Error in Employee" + JSON.stringify(err, undefined, 2))}
                })
            }
        }
        else { 
            //console.log("Error in Employee" + JSON.stringify(err, undefined, 2))
            return resp.status(500).send(`Error`)

        }
    })
    
   
})

router.get('/findUser', (req,resp) => {
    User.findOne(
        {
            username:req.query.username
        }
        ,(err, doc) => {
        if(!err) {
            if(doc) {
                if(doc.isValid(req.query.password)){
                    let token = jwt.sign({_id:doc._id},'secret');
                    //console.log(token)
                    return resp.status(200).json(token);
                
                }
                else{
                    return resp.status(400).send(`Invalid cradential`);
                }
                // console.log('Called findUser:Success');
                // resp.send(doc); 
            }
            else {
                //console.log('Called findUser:Failure');
                return resp.status(400).send(`No record with given username and  password`)
            }
           
        }
        else { console.log("Error in Employee" + JSON.stringify(err, undefined, 2))}
    })
});

router.get('/findUsers', (req,resp) => {
    var decoded;
    decoded = jwt.verify(req.header('token'), 'secret'); 
    // console.log(decoded.username)
    //console.log(decoded._id)
    User.findOne(
        {
            _id:decoded._id
        }
        ,(err, doc) => {
        if(!err) { resp.send(doc)}
        else { console.log('Error in retreving :'+ JSON.stringify(err, undefined, 2))}
        
    })
});




// router.put('/:id',(req,resp) => {
//     if (!objectId.isValid(req.params.id))
//         return resp.status(400).send(`No record with given id: ${req.params.id}`)
    
//     var emp = {
//         name : req.body.name,
//         position : req.body.position,
//         office : req.body.office,
//         salary : req.body.salary,
//     }

//     Register.findByIdAndUpdate(req.params.id, { $set: emp}, { new: true}, (err,doc) => {
//         if(!err) { resp.send(doc)}
//         else { console.log('Error in updating :'+ JSON.stringify(err, undefined, 2))}
//     })
// });

router.delete('/:id',(req,resp) => {
    console.log("inside delete")
    if (!objectId.isValid(req.params.id))
        return resp.status(400).send(`No record with given id: ${req.params.id}`)

    User.findByIdAndRemove(req.params.id, (err,doc) => {
        if(!err) { 
            console.log("king")
            resp.send(doc)}
        else { console.log('Error in deleting :'+ JSON.stringify(err, undefined, 2))}
    })
});

router.get('/getAllUser',(req,resp) => {
    User.find((err, doc) => {
        if(!err) { resp.send(doc)}
        else { console.log('Error in retreving :'+ JSON.stringify(err, undefined, 2))}
        
    })
})

// router.get('/update',(req,resp) => {
//     // console.log(req.query.username),
//     // console.log(req.query.message),

//     User.updateOne(
//       {username: req.query.username},
//       { $push: { message: [req.query.message] } },
//       function(err, result) {
//         if (err) {
//           resp.send(err);
//         } else {
//           resp.send(result);
//         }
//       }
//     );
// });

router.post('/post', (req,resp) => {
    // console.log(req.body.message)
    // console.log(req.body.username)
    // console.log("king")
    var user = new Post({
        message : req.body.message,
        username : req.body.username,
        date : Date.now()
    });
    
    
    user.save((err, docs) => {
        if(!err) {resp.send({}); }
        else { console.log("Error in Employee" + JSON.stringify(err, undefined, 2))}
    })
           
})

router.get('/post',(req,resp) => {
    Post.find((err, doc) => {
        if(!err) { resp.send(doc)}
        else { console.log('Error in retreving :'+ JSON.stringify(err, undefined, 2))}
        
    })
})

router.post('/comment', (req,resp) => {
    // console.log(req.body.comment)
    // console.log(req.body.postId)
    // console.log(req.body.commentowner)
    // console.log("king")
    var user = new Comment({
        comment : req.body.comment,
        postId : req.body.postId,
        commentowner : req.body.commentowner,
        date : Date.now()
    });
    
    
    user.save((err, docs) => {
        if(!err) {resp.send({}); }
        else { console.log("Error in Employee" + JSON.stringify(err, undefined, 2))}
    })
           
})

router.get('/comment',(req,resp) => {
    Comment.find((err, doc) => {
        if(!err) { resp.send(doc)}
        else { console.log('Error in retreving :'+ JSON.stringify(err, undefined, 2))}
        
    })
})

router.post('/like',(req,resp)=>{
    // console.log(req.body.liked)
    var user = {
        liked : req.body.liked,
        postId : req.body.postId,
        likerId : req.body.likerId,
        likerUsername : req.body.likerUsername,
        date : Date.now()
    };
    if (req.body.postId) {
        Like.updateOne({postId: req.body.postId, likerId: req.body.likerId}, user, {upsert: true},  (err,doc)=>{
            if(!err) { 
                    resp.send(doc);
                }
            else { console.log('Error in retreving :'+ JSON.stringify(err, undefined, 2))}
        });
    }
})

router.get('/like',(req,resp) => {
    Like.find((err, doc) => {
        if(!err) { resp.send(doc)}
        else { console.log('Error in retreving :'+ JSON.stringify(err, undefined, 2))}
        
    })
})

// router.post('/share', (req,resp) => {
//     // console.log(req.body.message)
//     // console.log(req.body.postUsername)
//     // console.log(req.body.shareUsername)
//     // console.log(req.body.postId)
//     // console.log("king")
//     var user = new Share({
//         message : req.body.message,
//         postUsername : req.body.postUsername,
//         shareUsername : req.body.shareUsername,
//         postId : req.body.postId,
//         date : Date.now()
//     });
    
    
//     user.save((err, docs) => {
//         if(!err) {resp.send({}); }
//         else { console.log("Error in Employee" + JSON.stringify(err, undefined, 2))}
//     })
           
// })

router.get('/share',(req,resp) => {
    
    Share.find((err, doc) => {
        if(!err) { resp.send(doc)}
        else { console.log('Error in retreving :'+ JSON.stringify(err, undefined, 2))}
        
    })
})



router.post('/share', (req,resp) => {
    // console.log(req.body.message)
    // console.log(req.body.username)
    // console.log(req.body.postOwner)
    // console.log(req.body.postId)
    console.log("king")
    var user = new Post({
        message : req.body.message,
        username : req.body.username,
        postOwner : req.body.postOwner,
        postId : req.body.postId,
        date : Date.now()
    });
    
    
    user.save((err, docs) => {
        if(!err) {resp.send({}); }
        else { console.log("Error in Employee" + JSON.stringify(err, undefined, 2))}
    })
           
})

module.exports = router;
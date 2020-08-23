const express = require('express');
var router = express.Router();
var objectId = require('mongoose').Types.ObjectId;
const { check, validationResult } = require('express-validator');

var { Register } = require('../models/employee');


router.get('/', (req,resp) => {
    Register.find((err, docs) => {
        if(!err) {resp.send(docs); }
        else { console.log("Error in Employee" + JSON.stringify(err, undefined, 2))}
    })
});

router.get('/findUser', (req,resp) => {
    console.log('Called findUser'+JSON.stringify(req.query));
    Register.findOne(
        {
            username:req.query.username, 
            password:req.query.password
        }
        ,(err, doc) => {
        if(!err) {
            if(doc) {
                    console.log('Called findUser:Success');

                 resp.send(doc); 
            }
            else {
                console.log('Called findUser:Failure');
                return resp.status(400).send(`No record with given username and  password`)
            }
           
        }
        else { console.log("Error in Employee" + JSON.stringify(err, undefined, 2))}
    })
});

router.get('/:id',(req,resp) => {
    if (!objectId.isValid(req.params.id))
        return resp.status(400).send(`No record with given id: ${req.params.id}`)
    
    Register.findById(req.params.id, (err,doc) => {
        if(!err) { resp.send(doc)}
        else { console.log('Error in retreving :'+ JSON.stringify(err, undefined, 2))}
    })
})

router.post('/', [
    check('phoneNo').matches('^\\+(?:[0-9] ?){6,14}[0-9]$').withMessage("error1"),
    check('email').matches('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$').withMessage("error2"),
    check('username').matches('^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$'),
    check('password').isLength({ min: 6 })
  ], (req,resp) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors)
        // return resp.status(422).send(errors.errors[0].msg);
        return resp.status(422).send(`Invalid details please check the details before register`);
    }

    var emp = new Register({
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        phoneNo : req.body.phoneNo,
        username : req.body.username,
        password : req.body.password,
    });
    console.log(req.body.email)

    Register.findOne(
        {
            username:req.body.username
        }
        ,(err, doc) => {
        if(!err) {
            if(doc) {
                return resp.status(500).send(`Username already taken`)
            }
            else {
                emp.save((err, docs) => {
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

router.put('/:id',(req,resp) => {
    if (!objectId.isValid(req.params.id))
        return resp.status(400).send(`No record with given id: ${req.params.id}`)
    
    var emp = {
        name : req.body.name,
        position : req.body.position,
        office : req.body.office,
        salary : req.body.salary,
    }

    Register.findByIdAndUpdate(req.params.id, { $set: emp}, { new: true}, (err,doc) => {
        if(!err) { resp.send(doc)}
        else { console.log('Error in updating :'+ JSON.stringify(err, undefined, 2))}
    })
});

router.delete('/:id',(req,resp) => {
    if (!objectId.isValid(req.params.username))
        return resp.status(400).send(`No record with given id: ${req.params.id}`)

    Register.findByIdAndRemove(req.params.id, (err,doc) => {
        if(!err) { resp.send(doc)}
        else { console.log('Error in deleting :'+ JSON.stringify(err, undefined, 2))}
    })
});



module.exports = router;
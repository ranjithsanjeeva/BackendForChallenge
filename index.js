const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');

const { mongoose } = require('./db.js');
var employeeController = require('./controlers/employeeControlers.js')

var app = express();
app.use(cors({origin: '*'}));
app.use(bodyParser.json());

app.listen(3000, () => console.log('Server started at port number: 3000')) 


app.use('/', employeeController)
// ***************************************************************
// Author: Chris MacDonald
// Date: April 28, 2023
// Description:  Main file to start server, connect to database and list routes
// ***************************************************************

//set environment variables
const dotenv = require('dotenv'); //must be the first 2 lines of code
dotenv.config({path: './config.env'});

//Template for Node.js Express Server
const express = require('express');

//Create express app
const app = express();

//Body-parser is a middleware that parses incoming requests with JSON payloads and is based on body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

//Path module provides utilities for working with file and directory paths
const path = require('path');

//debugging and logging
const morgan = require('morgan-body');

//middleware
//create a write stream (in append mode)
var rfs = require('rotating-file-stream'); // version 2.x

//serve static files
//create a rotating write stream
const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', //rotate daily
    path: path.join(__dirname, 'log'), //log directory will log all data here
})

//setup the logger
morgan(app, {
    stream: accessLogStream,
    noColors: true,
    logReqUserAgent: true,
    logRequestBody: true,
    logResponseBody: true,
    logReqCookies: true,
    logReqSignedCookies: true
});

//__dirname is the directory name of the current module
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    console.log('Hello from the middleware 👋');
    next();
});

//set the view engine to ejs
app.set('view engine', 'ejs');

// //set the views directory
// app.set('views', 'views');

//routes defined in routes folder
const user = require('./routes/user');
const loan = require('./routes/loan');
const list = require('./routes/list');
app.use('/', user);
app.use('/', loan);
app.use('/', list);

//404 page Error
app.use((err, req, res, next) => {
    res.status(404).render('404', {pageTitle: 'Page Not Found'});
});

//Connecting to the database
const mongoose = require('mongoose');
const MONGO_DATA_BASE = process.env.DATABASE.replace('<password>', process.env.DB_PASSWORD);

//asynchronous connection
mongoose.connect(MONGO_DATA_BASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(con => {
    // console.log(con.connection); //Logs connection properties
    console.log(`Successful Connection to Database`);
    // console.log(`App running on port ${port}`)
}).catch((err) => console.log(err));

//start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
// ***************************************************************
// Author: Chris MacDonald
// Date: April 28, 2023
// Description:  Controllers for user registration and login
// ***************************************************************

const User = require('../models/user');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');

exports.home = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    res.status(200).render('home', {message: 'Welcome to my Bank Loan App'}); // Send in signUp.ejs file
}

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    res.status(200).render('signUp', {pageTitle: 'Sign Up Form'}); // Send in signUp.ejs file
}

exports.signup = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    // Create User
    const {name, email, password, confirmPassword} = req.body;
    try{
        User.create({
            name: name,
            password: password,
            email: email,
            confirmPassword: confirmPassword
        });
        res.status(200).render('home', {message: `User Created`});
    } catch(error){
        console.log(error);
        const errors = validationResult(req);
        const errorDetails = [
            {
                "location": "Authorization",
                "msg": `${name} ${errors}`,
                "param": name
            }
        ];
        res.json({errors: errorDetails});
    }
}

exports.loginForm = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    res.status(200).render('login', {pageTitle: 'Login Form'}); // Send back the login.ejs files
}

exports.login = async (req, res) => {
    // Find the User
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return res.status(401).render('home', {message: `<<Error>> login unsuccessful, invalid credentials`});
    }
    // Compare Passwords
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if(!isMatch){
        return res.status(401).render('home', {message: `<<Error>> User: ${user.name} login unsuccessful`});
    }
    // Login User
    try{
        let token = await user.generateAuthToken();
        res.cookie('jwtoken', token, {
            expires: new Date(Date.now() + 25892000000),
            httpOnly: true
        });
        res.status(200).render('home', {message: `Welcome: ${user.name}`});
    } catch(error){
        console.log(error);
        res.status(401).render('home', {message: `User: ${user.name} Error: ${error} login unsuccessful`});
    }
}
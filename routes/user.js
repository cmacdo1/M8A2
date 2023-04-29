// ***************************************************************
// Author: Chris MacDonald
// Date: April 28, 2023
// Description:  Routes for user registration and login
// ***************************************************************

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Home Page
router.get('/home', userController.home);

// // Register new user
router.get('/signup', userController.register);
router.post('/signup', userController.signup);

// User login
router.get('/login', userController.loginForm);
router.post('/login', userController.login);

module.exports = router;
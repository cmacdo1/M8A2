// ***************************************************************
// Author: Chris MacDonald
// Date: April 28, 2023
// Description:  Routes for viewing loan
// ***************************************************************

const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');

router.get('/viewLoan', listController.getList);

module.exports = router;
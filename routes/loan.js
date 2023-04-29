// ***************************************************************
// Author: Chris MacDonald
// Date: April 28, 2023
// Description:  Routes for loan application
// ***************************************************************

const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

// Apply for Loan Page
router.get('/applyLoan', loanController.applyLoan);
router.post('/applyLoan', loanController.apply);

module.exports = router;
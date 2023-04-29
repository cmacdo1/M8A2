// ***************************************************************
// Author: Chris MacDonald
// Date: April 28, 2023
// Description:  Controllers for applying for loan
// ***************************************************************

const Loan = require('../models/loans');
const User = require('../models/user');
const {check, validationResult} = require('express-validator');

exports.applyLoan = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    res.status(200).render('applyLoan', {message: 'Submit an Application for a Loan'}); // Send in applyLoan.ejs file
}

exports.apply = async (req, res) => {
    console.log(req.user);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    // Create Loan Application
    const {loanType, loanAmount, interestRate, repaymentTerm} = req.body;
    try{
        Loan.create({
            loanType: loanType,
            loanAmount: loanAmount,
            interestRate: interestRate,
            repaymentTerm: repaymentTerm
        })
        res.status(200).render('home', {message: `Application Submitted`});
    } catch(error){
        console.log(error);
    }
}
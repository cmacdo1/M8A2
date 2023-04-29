// ***************************************************************
// Author: Chris MacDonald
// Date: April 28, 2023
// Description:  Creates and defines Loan Schema
// ***************************************************************

const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    loanType: {
        type: String,
        required: [true, 'The type of loan is required (ex: Home, Auto, Medical, Life)'],
        trim: true,
        enum: ['Auto', 'Home', 'Life', 'Medical'],
    },
    loanAmount: {
        type: Number,
        required: [true, 'A loan amount is required'],
        trim: true,
        min: 1,
    },
    interestRate: {
        type: Number,
        required: [true, 'An interest amount is required'],
        trim: true,
        enum: {
            values: [3, 5, 8],
            message: '{VALUE} is not supported'
        }
    },
    repaymentTerm: {
        type: Number,
        required: [true, 'The length of the loan is required'],
        trim: true,
        min: 1,
        max: 35,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Loan = mongoose.model('Loan', loanSchema);
module.exports = Loan;
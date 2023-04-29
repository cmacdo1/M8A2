// ***************************************************************
// Author: Chris MacDonald
// Date: April 28, 2023
// Description:  Controllers for view loans
// ***************************************************************

const Loan = require('../models/loans');

exports.getList = async (req, res) => {
    try {
        const loans = await Loan.find();
        res.render('list', {loans});
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};
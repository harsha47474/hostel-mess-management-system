const express = require('express');
const router = express.Router();
const isLoggedIn = require('../../middlewares/isLoggedIn').isLoggedIn;
const isStudent = require('../../middlewares/isStudent').isStudent;
const wrapAsync = require('../../utils/wrapAsync');
const Attendance = require('../../models/attendance');
const Bill = require('../../models/bills');

router.get('/billing', isLoggedIn, isStudent, async (req, res) => {
    const today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();


    if (month === 0) {
        month = 11;
        year = year - 1;
    } else {
        month = month - 1;
    }

    const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });


    const records = await Attendance.find({
        student: req.user._id,
        date: { $regex: `^${year}-${String(month + 1).padStart(2, '0')}` }
    });

    if (records.length === 0) {

        return res.render('student/billing.ejs', { user: req.user, bills: [] });
    }


    const presentCount = records.filter(r => r.status === 'present').length;
    const amount = presentCount * 100;


    let bill = await Bill.findOne({ student: req.user._id, month: monthName, year });
    if (!bill) {
        bill = new Bill({
            student: req.user._id,
            month: monthName,
            year,
            amount,
            status: 'pending'
        });
        await bill.save();
    }


    const bills = await Bill.find({ student: req.user._id }).sort({ year: -1, createdAt: -1 });
    const totalPending = bills
        .filter(b => b.status === 'pending')
        .reduce((sum, b) => sum + b.amount, 0);

    res.render('student/billing.ejs', { user: req.user, bills, totalPending });
});



module.exports = router;
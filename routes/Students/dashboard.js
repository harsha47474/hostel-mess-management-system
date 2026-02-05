const exprees = require('express');
const router = exprees.Router();
const isLoggedIn = require('../../middlewares/isLoggedIn').isLoggedIn;
const isStudent = require('../../middlewares/isStudent').isStudent;
const Bill = require('../../models/bills');
const Attendance = require('../../models/attendance');
const wrapAsync = require('../../utils/wrapAsync');

router.get("/dashboard", isLoggedIn, isStudent, wrapAsync(async (req, res) => {
    const bills = await Bill.find({ student: req.user._id });
    const totalPending = bills
        .filter(b => b.status === 'pending')
        .reduce((sum, b) => sum + b.amount, 0);

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); 
    const monthName = today.toLocaleString('default', { month: 'long' });

    const records = await Attendance.find({
        student: req.user._id,
        date: { $regex: `^${year}-${String(month + 1).padStart(2, '0')}` }
    });

    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const totalDays = present + absent;
    const rate = totalDays > 0 ? Math.round((present / totalDays) * 100) : 0;




    res.render("student/dashboard.ejs", { user: req.user, totalPending ,rate});
}));


module.exports = router;
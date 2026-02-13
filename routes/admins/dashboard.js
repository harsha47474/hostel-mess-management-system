const exprees = require('express');
const router = exprees.Router();
const User = require('../../models/user');
const Bill = require('../../models/bills');
const Complaint = require('../../models/complaints');
const Attendance = require('../../models/attendance');
const wrapAsync = require('../../utils/wrapAsync');
const isAdmin = require('../../middlewares/isAdmin').isAdmin;
const isLoggedIn = require('../../middlewares/isLoggedIn').isLoggedIn;


router.get("/dashboard", isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
    const totalStudents = await User.countDocuments({ role: 'student' });

    
    const pendingBills = await Bill.find({ status: 'pending' });
    const totalPendingBills = pendingBills.reduce((sum, b) => sum + b.amount, 0);

    const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });

    const attendanceRecords = await Attendance.find({});
    const present = attendanceRecords.filter(r => r.status === 'present').length;
    const absent = attendanceRecords.filter(r => r.status === 'absent').length;
    const total = present + absent;
    const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

    
    const recentComplaints = await Complaint.find({})
        .populate('student')
        .sort({ createdAt: -1 })
        .limit(2);

    const recentBills = await Bill.find({ status: 'paid' })
        .populate('student')
        .sort({ updatedAt: -1 })
        .limit(2);

    const recentAttendance = await Attendance.find({})
        .sort({ createdAt: -1 })
        .limit(1);

    
    const activities = [];

    recentComplaints.forEach(c => {
        activities.push({
            type: 'Complaint',
            message: `New complaint raised`,
            by: c.student?.username || 'Unknown',
            time: c.createdAt
        });
    });

    recentBills.forEach(b => {
        activities.push({
            type: 'Bill',
            message: `Bill payment received`,
            by: b.student?.username || 'Unknown',
            time: b.updatedAt
        });
    });

    recentAttendance.forEach(a => {
        activities.push({
            type: 'Attendance',
            message: `Attendance marked`,
            by: 'admin',
            time: a.createdAt
        });
    });

    
    activities.sort((a, b) => b.time - a.time);

    res.render('admin/dashboard.ejs', {
        user: req.user,
        totalStudents,
        totalPendingBills,
        pendingComplaints,
        attendanceRate,
        activities
    });
}));



module.exports = router;
const express = require('express');
const router = express.Router();
const isLoggedIn = require('../../middlewares/isLoggedIn').isLoggedIn;
const Attendance = require("../../models/attendance");
const isStudent = require('../../middlewares/isStudent').isStudent;
const wrapAsync = require('../../utils/wrapAsync');

router.get('/attendance', isLoggedIn, isStudent, wrapAsync(async (req, res) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); 
  const monthName = today.toLocaleString('default', { month: 'long' });
  const todayStr = today.toISOString().split('T')[0];

  // Get all days in this month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dates = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    dates.push(dateStr);
  }

  // Fetch attendance records for this student in this month
  const records = await Attendance.find({
    student: req.user._id,
    date: { $regex: `^${year}-${String(month + 1).padStart(2, '0')}` }
  });

  // Map records into lookup
  const recordMap = {};
  records.forEach(r => { recordMap[r.date] = r.status; });

  // Build calendar array
  const calendar = dates.map(dateStr => {
    const dayNum = parseInt(dateStr.split('-')[2]);
    const dateObj = new Date(dateStr);

    let status;
    if (dateObj <= today) {
      // Past or today → check DB, default absent
      status = recordMap[dateStr] || 'absent';
    } else {
      // Future → upcoming
      status = 'upcoming';
    }

    return {
      day: dayNum,
      status,
      isToday: dateStr === todayStr
    };
  });


  const present = calendar.filter(d => d.status === 'present').length;
  const absent = calendar.filter(d => d.status === 'absent').length;
  const totalDays = present + absent;
  const rate = totalDays > 0 ? Math.round((present / totalDays) * 100) : 0;

  res.render('student/attendance.ejs', {
    user: req.user,
    calendar,
    present,
    absent,
    rate,
    monthName,
    year
  });
}));


module.exports = router;
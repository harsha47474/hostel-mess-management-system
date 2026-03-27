const mongoose = require('mongoose');
const Attendance = require('../models/attendance');
const User = require('../models/user');
const connectDB = require('../config/db');

async function seedAttendance() {
  await connectDB();

  const student = await User.findOne({ email: "student1@hostel.com" });
  console.log(student);

  const year = 2026;
  const month = 0;
  const daysInMonth = new Date(year, month + 1, 0).getDate();


  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const status = d % 2 === 0 ? 'absent' : 'present';

    await Attendance.create({
      student: student._id,
      date: dateStr,
      status
    });
  }

  console.log('Seeded January attendance!');
  mongoose.connection.close();
}

seedAttendance();
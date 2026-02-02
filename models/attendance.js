const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ['present', 'absent'], default: 'absent' }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
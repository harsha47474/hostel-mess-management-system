const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
  user:{
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  mealType: {
    type: String,
    enum: ["Breakfast", "Lunch", "Dinner"],
    required: true
  },

  plateType: {
    type: String,
    enum: ["Veg", "Non-Veg"],
    required: true
  },

  date: {
    type: Date,
    required: true
  }
}, { timestamps: true });

attendanceSchema.index(
  { user: 1, mealType: 1, date: 1 },
  { unique: true }
);


module.exports = mongoose.model('Attendance', attendanceSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messSchema = new Schema({
  day: { 
    type: String, 
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], 
    required: true 
  },
  mealType: { 
    type: String, 
    enum: ["breakfast", "lunch", "dinner"], 
    required: true 
  },
  items: [
    {
      name: { type: String, required: true },
      isVeg: { type: Boolean, default: true }
    }
  ]
}, { timestamps: true });

const Mess = mongoose.model('Mess', messSchema);
module.exports = Mess;
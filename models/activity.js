const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
    action: String,            // "Student Added", "Complaint Submitted"
    performedBy: String,       // Admin or Student name
    target: String,            // Target entity (student name)
    type: String,              // "student", "complaint", "billing"
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Activity", activitySchema);
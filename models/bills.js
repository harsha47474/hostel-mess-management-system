const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const billSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    months: {
        type: Number,
        min: 1
    },

    startDate: Date,
    endDate: Date,

    amount: Number,

    status: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending"
    },

    paymentDate: Date,
    transactionId: String

}, { timestamps: true });

module.exports = mongoose.model("Bill", billSchema);
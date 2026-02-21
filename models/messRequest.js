const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messRequestSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    months: {
        type: Number,
        min: 1,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
}, { timestamps: true });

module.exports = mongoose.model("MessRequest", messRequestSchema);
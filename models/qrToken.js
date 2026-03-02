const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const qrTokenSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    mealType: {
        type: String,
        enum: ["Breakfast", "Lunch", "Dinner"],
        required:true
    },

    plateType:{
        type: String,
        enum:["Veg", "Non-Veg"],
        required: true
    },

    token: {
        type: String,
        required: true,
        unique: true
    },

    expiresAt: {
        type: Date,
        required: true
  },

  used: {
    type: Boolean,
    default: false
  }
},{ timestamps: true });

module.exports = mongoose.model("QRToken", qrTokenSchema);
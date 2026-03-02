// config/db.js
const mongoose = require('mongoose');

const MONGO_URL = "mongodb://127.0.0.1:27017/hostel_mess_management";

async function connectToDB() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
        process.exit(1);
    }
}

module.exports = connectToDB;
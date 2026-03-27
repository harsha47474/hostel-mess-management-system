require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');

async function connectToDB() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in the environment variables");
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB via Environment Variable");
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err.message);
        process.exit(1);
    }
}

module.exports = connectToDB;
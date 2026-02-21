const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose').default;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        required: true,
        default: 'student'
    },
    rollNumber: {
        type: String,
        required: function () { return this.role === 'student'; }
    },
    messStatus: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },

    messSubscription: {
        startDate: Date,
        endDate: Date
    },

    foodPreference: {
        type: String,
        enum: ['Veg', 'Non-Veg'],
        required: function () { return this.role === 'student'; }
    }
}, { timestamps: true });

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);
module.exports = User;
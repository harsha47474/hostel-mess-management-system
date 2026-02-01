const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose').default;

const userSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['student', 'admin'],
        required: true
    },
    rollNumber:{
        type: String,
        required: function() { return this.role === 'student';}
    }
}, { timestamps: true });

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);
module.exports = User;
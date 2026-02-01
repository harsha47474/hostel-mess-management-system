const mongoose = require('mongoose');
const User = require('../models/user');
const passportLocalMongoose = require('passport-local-mongoose').default;

const MONGO_URL = "mongodb://localhost:27017/hostel_mess_management";
async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("Connected to MongoDB");
        seedUsers();
    }).catch(err => {
        console.error("Failed to connect to MongoDB", err);
    });

async function seedUsers() {
    await User.deleteMany({});

    //Admins data
    const admins = [
        {
            username:"warden",
            email: "warden@hostel.com",
            role: "admin"
        },
        {
            username:"manager",
            email: "manager@hostel.com",
            role: "admin"
        }
    ];

    const adminPasswords = [
        "warden@123",
        "manager@456"
    ];

    for (let i = 0; i < admins.length; i++) {
        await User.register(admins[i], adminPasswords[i]);
    }

    // Students data
    const students = [
        { username: "Harsha", email: "student1@hostel.com", role: "student", rollNumber: "CS101" },
        { username: "Rahul", email: "student2@hostel.com", role: "student", rollNumber: "CS102" },
        { username: "Priya", email: "student3@hostel.com", role: "student", rollNumber: "CS103" },
        { username: "Karan", email: "student4@hostel.com", role: "student", rollNumber: "CS104" },
        { username: "Sneha", email: "student5@hostel.com", role: "student", rollNumber: "CS105" },
        { username: "Vikram", email: "student6@hostel.com", role: "student", rollNumber: "CS106" },
        { username: "Ananya", email: "student7@hostel.com", role: "student", rollNumber: "CS107" },
        { username: "Karthik", email: "student8@hostel.com", role: "student", rollNumber: "CS108" },
        { username: "Ishaan", email: "student9@hostel.com", role: "student", rollNumber: "CS109" },
        { username: "Riya", email: "student10@hostel.com", role: "student", rollNumber: "CS110" }
    ];

    const studentPasswords = [
        "stud1@123",
        "stud2@123",
        "stud3@123",
        "stud4@123",
        "stud5@123",
        "stud6@123",
        "stud7@123",
        "stud8@123",
        "stud9@123",
        "stud10@123"
    ];

    for (let i = 0; i < students.length; i++) {
        await User.register(students[i], studentPasswords[i]);
    }

    console.log("Demo users created successfully");
    mongoose.connection.close();
}

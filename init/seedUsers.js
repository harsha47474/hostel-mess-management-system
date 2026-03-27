const mongoose = require('mongoose');
const User = require('../models/user');
const passportLocalMongoose = require('passport-local-mongoose').default;

const connectDB = require('../config/db');

async function main() {
    await connectDB();
}

main()
    .then(() => {
        seedUsers();
    });


function addMonths(date, months) {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
}

const today = new Date();


async function seedUsers() {
    await User.deleteMany({});

    //Admins data
    const admins = [
        {
            username: "warden",
            email: "warden@hostel.com",
            role: "admin"
        },
        {
            username: "manager",
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
        {
            username: "Harsha",
            email: "student1@hostel.com",
            role: "student",
            rollNumber: "CS101",
            foodPreference: "Veg",
            messStatus: "active",
            messSubscription: {
                startDate: today,
                endDate: addMonths(today, 1)
            }
        },
        {
            username: "Rahul",
            email: "student2@hostel.com",
            role: "student",
            rollNumber: "CS102",
            foodPreference: "Non-Veg",
            messStatus: "active",
            messSubscription: {
                startDate: today,
                endDate: addMonths(today, 3)
            }
        },
        {
            username: "Priya",
            email: "student3@hostel.com",
            role: "student",
            rollNumber: "CS103",
            foodPreference: "Veg",
            messStatus: "inactive"
        },
        {
            username: "Karan",
            email: "student4@hostel.com",
            role: "student",
            rollNumber: "CS104",
            foodPreference: "Non-Veg",
            messStatus: "active",
            messSubscription: {
                startDate: addMonths(today, -3),
                endDate: addMonths(today, -1) // expired
            }
        },
        {
            username: "Sneha",
            email: "student5@hostel.com",
            role: "student",
            rollNumber: "CS105",
            foodPreference: "Veg",
            messStatus: "active",
            messSubscription: {
                startDate: today,
                endDate: addMonths(today, 5)
            }
        },
        {
            username: "Vikram",
            email: "student6@hostel.com",
            role: "student",
            rollNumber: "CS106",
            foodPreference: "Non-Veg",
            messStatus: "inactive"
        },
        {
            username: "Ananya",
            email: "student7@hostel.com",
            role: "student",
            rollNumber: "CS107",
            foodPreference: "Veg",
            messStatus: "active",
            messSubscription: {
                startDate: today,
                endDate: addMonths(today, 2)
            }
        },
        {
            username: "Karthik",
            email: "student8@hostel.com",
            role: "student",
            rollNumber: "CS108",
            foodPreference: "Non-Veg",
            messStatus: "active",
            messSubscription: {
                startDate: today,
                endDate: addMonths(today, 4)
            }
        },
        {
            username: "Ishaan",
            email: "student9@hostel.com",
            role: "student",
            rollNumber: "CS109",
            foodPreference: "Non-Veg",
            messStatus: "active",
            messSubscription: {
                startDate: addMonths(today, -2),
                endDate: today // expires today
            }
        },
        {
            username: "Riya",
            email: "student10@hostel.com",
            role: "student",
            rollNumber: "CS110",
            foodPreference: "Veg",
            messStatus: "inactive"
        }
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

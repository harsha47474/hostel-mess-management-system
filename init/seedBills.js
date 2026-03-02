const mongoose = require("mongoose");
const Bill = require("../models/bills");
const User = require("../models/user");

mongoose.connect("mongodb://127.0.0.1:27017/hostel_mess_management")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

const seedBills = async () => {
    try {
        await Bill.deleteMany({});
        console.log("Old bills deleted");

        const students = await User.find({ role: "student" });

        if (students.length === 0) {
            console.log("No students found");
            return;
        }

        let bills = [];

        students.forEach(student => {

            if (
                student.messStatus === "active" &&
                student.messSubscription &&
                student.messSubscription.startDate &&
                student.messSubscription.endDate
            ) {

                const start = new Date(student.messSubscription.startDate);
                const end = new Date(student.messSubscription.endDate);

                const months =
                    (end.getFullYear() - start.getFullYear()) * 12 +
                    (end.getMonth() - start.getMonth());

                const amountPerMonth = 3000;
                const totalAmount = months * amountPerMonth;

                bills.push({
                    user: student._id,
                    months,
                    startDate: start,
                    endDate: end,
                    amount: totalAmount,
                    status: "paid", // ✅ FORCE PAID
                    paymentDate: new Date(),
                    transactionId: "TXN" + Math.floor(Math.random() * 1000000)
                });
            }

            if (student.messStatus === "inactive" &&
                student.messSubscription &&
                student.messSubscription.startDate &&
                student.messSubscription.endDate
            ) {

                const start = new Date(student.messSubscription.startDate);
                const end = new Date(student.messSubscription.endDate);

                const months =
                    (end.getFullYear() - start.getFullYear()) * 12 +
                    (end.getMonth() - start.getMonth());

                const amountPerMonth = 3000;
                const totalAmount = months * amountPerMonth;

                bills.push({
                    user: student._id,
                    months,
                    startDate: start,
                    endDate: end,
                    amount: totalAmount,
                    status: "paid", // ✅ Because they used it already
                    paymentDate: end,
                    transactionId: "TXN" + Math.floor(Math.random() * 1000000)
                });
            }
        });

        await Bill.insertMany(bills);

        console.log("Bills created for all students!");
        mongoose.connection.close();

    } catch (err) {
        console.log(err);
    }
};

seedBills();
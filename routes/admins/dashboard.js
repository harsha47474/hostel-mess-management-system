const exprees = require('express');
const router = exprees.Router();
const User = require('../../models/user');
const Bill = require('../../models/bills');
const Complaint = require('../../models/complaints');
const Attendance = require('../../models/attendance');
const wrapAsync = require('../../utils/wrapAsync');
const isAdmin = require('../../middlewares/isAdmin').isAdmin;
const isLoggedIn = require('../../middlewares/isLoggedIn').isLoggedIn;
const Activity = require("../../models/activity");


router.get("/dashboard", isLoggedIn, isAdmin, async (req, res) => {
    try {

        const students = await User.find({ role: "student" });
        const activities = await Activity.find()
            .sort({ createdAt: -1 })
            .limit(5);

        const paidBills = await Bill.find({ status: "paid" });

        const today = new Date();

        let totalStudents = students.length;
        let activeCount = 0;
        let expiredCount = 0;
        let expiringSoonCount = 0;

        let vegCount = 0;
        let nonVegCount = 0;

        students.forEach(student => {
            if (student.foodPreference === "Veg") vegCount++;
            if (student.foodPreference === "Non-Veg") nonVegCount++;
        });

        // ================= SUBSCRIPTION DISTRIBUTION =================
        students.forEach(student => {
            const expiry = student.messSubscription?.endDate;
            if (!expiry) return;

            const expiryDate = new Date(expiry);
            const diffDays =
                (expiryDate - today) / (1000 * 60 * 60 * 24);

            if (expiryDate > today) {
                activeCount++;
                if (diffDays <= 7) expiringSoonCount++;
            } else {
                expiredCount++;
            }
        });

        // ================= REVENUE (LAST 6 MONTHS) =================

        let revenueData = [];
        let labels = [];

        for (let i = 5; i >= 0; i--) {

            const d = new Date();
            d.setMonth(d.getMonth() - i);

            const month = d.getMonth();
            const year = d.getFullYear();

            labels.push(
                d.toLocaleString('default', { month: 'short' })
            );

            let monthlyRevenue = 0;

            paidBills.forEach(bill => {
                if (!bill.paymentDate) return;

                const billDate = new Date(bill.paymentDate);

                if (
                    billDate.getMonth() === month &&
                    billDate.getFullYear() === year
                ) {
                    monthlyRevenue += bill.amount;
                }
            });

            revenueData.push(monthlyRevenue);
        }

        res.render("admin/dashboard", {
            totalStudents,
            activeCount,
            expiredCount,
            expiringSoonCount,
            activities,
            revenueData,
            labels,
            vegCount,
            nonVegCount
        });

    } catch (err) {
        console.log(err);
        res.redirect("/admins/students");
    }
});

module.exports = router;
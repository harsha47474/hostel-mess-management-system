const exprees = require('express');
const router = exprees.Router();
const isLoggedIn = require('../../middlewares/isLoggedIn').isLoggedIn;
const User = require('../../models/user.js')
const isStudent = require('../../middlewares/isStudent').isStudent;
const Bill = require('../../models/bills');
const Activity = require('../../models/activity')
const Attendance = require('../../models/attendance');
const wrapAsync = require('../../utils/wrapAsync');
const Mess = require('../../models/menu')

router.get("/dashboard", isStudent, isLoggedIn, wrapAsync(async (req, res) => {
    try {

        const student = await User.findById(req.user._id);
        const today = new Date();

        // ===============================
        // GET TODAY NAME
        // ===============================
        const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        const todayName = days[today.getDay()];

        // ===============================
        // FETCH TODAY MENU
        // ===============================
        const messData = await Mess.find({ day: todayName });

        // Convert DB format to EJS format
        const menu = messData.map(meal => ({
            type: meal.mealType,
            name: meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1),
            items: meal.items.map(i => i.name).join(", "),
            time:
                meal.mealType === "breakfast" ? "7:30 AM - 9:30 AM" :
                meal.mealType === "lunch" ? "12:30 PM - 2:30 PM" :
                "7:30 PM - 9:30 PM"
        }));

        // ===============================
        // SUBSCRIPTION DETAILS
        // ===============================
        let status = "Expired";
        let daysRemaining = 0;

        if (student.messSubscription?.endDate) {
            const endDate = new Date(student.messSubscription.endDate);
            const diff = (endDate - today) / (1000 * 60 * 60 * 24);
            daysRemaining = Math.ceil(diff);

            if (endDate > today) {
                status = daysRemaining <= 7 ? "Expiring Soon" : "Active";
            }
        }

        // ===============================
        // BILL DATA
        // ===============================
        const bills = await Bill.find({ user: req.user._id })
            .sort({ createdAt: -1 });

        const lastBill = bills[0];

        const totalPaid = bills
            .filter(b => b.status === "paid")
            .reduce((sum, bill) => sum + bill.amount, 0);

        // ===============================
        // ACTIVITIES
        // ===============================
        const activities = await Activity.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(5);

        res.render("student/dashboard", {
            user: req.user,
            student,
            status,
            daysRemaining,
            bills,
            lastBill,
            totalPaid,
            activities,
            menu
        });

    } catch (err) {
        console.log(err);
        res.redirect("/");
    }
}));



module.exports = router;
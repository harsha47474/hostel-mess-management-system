const express = require('express');
const router = express.Router();
const isLoggedIn = require('../../middlewares/isLoggedIn').isLoggedIn;
const isAdmin = require('../../middlewares/isAdmin').isAdmin;
const wrapAsync = require('../../utils/wrapAsync');

const MessRequest = require('../../models/messRequest');
const Bill = require('../../models/bills');
const User = require('../../models/user');

// ================= GET - View All Billing =================
router.get("/billing",
    isLoggedIn,
    isAdmin,
    wrapAsync(async (req, res) => {

        // Pending requests
        const requests = await MessRequest
            .find({ status: "pending" })
            .populate("user");

        // All bills
        const bills = await Bill
            .find()
            .populate("user")
            .sort({ createdAt: -1 });

        // ================= STATS CALCULATION =================

        // Active subscriptions count
        const activeCount = await User.countDocuments({
            messStatus: "active"
        });

        // Revenue calculations
        const paidBills = bills.filter(b => b.status === "paid");

        const totalRevenue = paidBills.reduce((sum, bill) => {
            return sum + bill.amount;
        }, 0);

        // This month revenue
        const now = new Date();
        const monthlyRevenue = paidBills
            .filter(bill =>
                bill.paymentDate &&
                bill.paymentDate.getMonth() === now.getMonth() &&
                bill.paymentDate.getFullYear() === now.getFullYear()
            )
            .reduce((sum, bill) => sum + bill.amount, 0);

        res.render("admin/billing", {
            requests,
            bills,
            activeCount,
            monthlyRevenue,
            totalRevenue
        });
    })
);

// ================= POST - Approve Request =================
router.post("/billing/approve/:id",
    isLoggedIn,
    isAdmin,
    wrapAsync(async (req, res) => {

        const request = await MessRequest
            .findById(req.params.id)
            .populate("user");

        if (!request) return res.redirect("/admins/billing");

        const monthlyRate = 3000;
        const amount = request.months * monthlyRate;

        let startDate = new Date();

        const user = await User.findById(request.user._id);

        if (
            user.messSubscription &&
            user.messSubscription.endDate &&
            user.messSubscription.endDate > new Date()
        ) {
            // Subscription still active → extend from end date
            startDate = new Date(user.messSubscription.endDate);
        }
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + request.months);

        const newBill = new Bill({
            user: request.user._id,
            months: request.months,
            startDate,
            endDate,
            amount,
            status: "pending"
        });

        await newBill.save();

        request.status = "approved";
        await request.save();

        res.redirect("/admins/billing");
    })
);

// ================= POST - Reject Request =================
router.post("/billing/reject/:id",
    isLoggedIn,
    isAdmin,
    wrapAsync(async (req, res) => {

        const request = await MessRequest.findById(req.params.id);

        if (!request) return res.redirect("/admins/billing");

        request.status = "rejected";
        await request.save();

        res.redirect("/admins/billing");
    })
);

module.exports = router;
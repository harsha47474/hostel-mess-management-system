const express = require('express');
const router = express.Router();
const isLoggedIn = require('../../middlewares/isLoggedIn').isLoggedIn;
const isStudent = require('../../middlewares/isStudent').isStudent;
const wrapAsync = require('../../utils/wrapAsync');
const User = require('../../models/user')
const Bill = require('../../models/bills');
const MessRequest = require('../../models/messRequest')
const PDFDocument = require("pdfkit");

// GET - Billing Dashboard
router.get("/billing",
    isLoggedIn,
    isStudent,
    wrapAsync(async (req, res) => {

        const user = await User.findById(req.user._id);

        const bills = await Bill.find({
            user: req.user._id
        }).sort({ createdAt: -1 });

        const existingRequest = await MessRequest.findOne({
            user: req.user._id,
            status: "pending"
        });

        const pendingBill = await Bill.findOne({
            user: req.user._id,
            status: "pending"
        });

        let canApply = false;

        if (!existingRequest && !pendingBill) {
            if (user.messStatus === "inactive") {
                canApply = true;
            } else if (user.messSubscription?.endDate) {

                const diffTime = user.messSubscription.endDate - new Date();
                const diffDays = diffTime / (1000 * 60 * 60 * 24);

                if (diffDays <= 30) {
                    canApply = true;
                }
            }
        }

        res.render("student/billing", {
            user,
            bills,
            canApply,
            existingRequest
        });
    })
);

// REQUEST ACCESS FOR MESS / MESS SUBSCRIPTION REQUEST
router.post("/request-mess",
    isLoggedIn,
    isStudent,
    wrapAsync(async (req, res) => {

        const { months } = req.body;

        if (months < 1) {
            return res.send("Minimum 1 month required.");
        }

        const existingRequest = await MessRequest.findOne({
            user: req.user._id,
            status: "pending"
        });

        if (existingRequest) {
            return res.send("You already have a pending request.");
        }

        const pendingBill = await Bill.findOne({
            user: req.user._id,
            status: "pending"
        });

        if (pendingBill) {
            return res.send("You already have a pending bill.");
        }

        const request = new MessRequest({
            user: req.user._id,
            months
        });

        await request.save();

        res.redirect("/student/billing");
    })
);


router.post("/pay/:billId", isLoggedIn, async (req, res) => {
    const { billId } = req.params;

    const bill = await Bill.findById(billId);
    if (!bill) {
        req.flash("error", "Bill not found");
        return res.redirect("/student/billing");
    }

    // Fake Payment Logic
    bill.status = "paid";
    bill.paymentDate = new Date();
    bill.transactionId = "TXN" + Date.now();

    await bill.save();

    // 🔥 Now handle subscription update

    const user = await User.findById(req.user._id);

    if (user.messStatus === "active" && user.messSubscription?.endDate) {
        // Extend existing subscription
        user.messSubscription.endDate = bill.endDate;
    } else {
        // Create new subscription
        user.messStatus = "active";
        user.messSubscription = {
            startDate: bill.startDate,
            endDate: bill.endDate
        };
    }

    await user.save();

    req.flash("success", "Payment Successful!");
    res.redirect("/student/billing");
});


router.get("/receipt/:billId/download", isLoggedIn, async (req, res) => {
    const { billId } = req.params;

    const bill = await Bill.findById(billId).populate("user");
    if (!bill) {
        req.flash("error", "Bill not found");
        return res.redirect("/student/billing");
    }

    if (bill.status !== "paid") {
        req.flash("error", "Receipt available only for paid bills");
        return res.redirect("/student/billing");
    }

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename=receipt-${bill._id}.pdf`
    );

    doc.pipe(res);

    // ===== Receipt Design =====
    doc
        .fontSize(20)
        .text("Hostel Mess Payment Receipt", { align: "center" });

    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Transaction ID: ${bill.transactionId}`);
    doc.text(`Student Name: ${bill.user.username}`);
    doc.text(`Payment Date: ${bill.paymentDate?.toDateString()}`);
    doc.text(`Subscription Start: ${bill.startDate?.toDateString()}`);
    doc.text(`Subscription End: ${bill.endDate?.toDateString()}`);
    doc.text(`Amount Paid: ₹ ${bill.amount}`);

    doc.moveDown();
    doc.text("Thank you for your payment.", { align: "center" });

    doc.end();
});


module.exports = router;
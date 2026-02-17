const express = require('express');
const router = express.Router();
const isLoggedIn = require('../../middlewares/isLoggedIn').isLoggedIn;
const isAdmin = require('../../middlewares/isAdmin').isAdmin;
const wrapAsync = require('../../utils/wrapAsync')
const QRToken = require('../../models/qrToken');
const Attendance = require('../../models/attendance');


router.get("/scan", isLoggedIn, isAdmin, (req, res) => {
    res.render("admin/scan");
});


router.post("/scan", isLoggedIn, isAdmin, wrapAsync(async (req, res) => {

    const { token } = req.body;

    if (!token) {
        return res.send("Invalid QR Code");
    }

    const qrToken = await QRToken.findOne({ token }).populate("user");

    if (!qrToken) {
        return res.send("QR Not Found");
    }

    if (qrToken.used) {
        return res.send("QR Already Used");
    }

    if (qrToken.expiresAt < new Date()) {
        return res.send("QR Expired");
    }

    // Check attendance already marked
    const today = new Date();
    const startOfDay = new Date(today.setHours(0,0,0,0));
    const endOfDay = new Date(today.setHours(23,59,59,999));

    const existingAttendance = await Attendance.findOne({
        user: qrToken.user._id,
        mealType: qrToken.mealType,
        date: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    });

    if (existingAttendance) {
        qrToken.used = true;
        await qrToken.save();
        return res.send("Attendance Already Marked");
    }

    // Create attendance
    await Attendance.create({
        user: qrToken.user._id,
        mealType: qrToken.mealType,
        plateType: qrToken.plateType,
        date: new Date()
    });

    // Mark token as used
    qrToken.used = true;
    await qrToken.save();

    res.send("Attendance Marked Successfully ✅");

}));


module.exports = router;
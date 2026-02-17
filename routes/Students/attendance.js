const express = require('express');
const router = express.Router();
const isMessActive = require('../../middlewares/isMessActive').isMessActive;
const isLoggedIn = require('../../middlewares/isLoggedIn').isLoggedIn;
const Attendance = require("../../models/attendance");
const isStudent = require('../../middlewares/isStudent').isStudent;
const wrapAsync = require('../../utils/wrapAsync');
const crypto = require("crypto");
const QRCode = require("qrcode");
const QRToken = require("../../models/qrToken");
const getCurrentMeal = require("../../utils/getCurrentMeal");

router.get("/generate-qr", isLoggedIn, isStudent, isMessActive, wrapAsync(async (req, res) => {
    const user = req.user;
    const meal = getCurrentMeal();
    if (!meal) {
        return res.send("No meal is currently being served. QR code generation is only available during meal times.");
    }

    // check attended already or not
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existingAttendance = await Attendance.findOne({
        user: user._id,
        mealType: meal,
        date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (existingAttendance) {
        return res.render("student/attendance", {
            user,
            meal,
            approved: true
        });
    }

    let plateType = user.foodPreference || "Veg";

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const existingToken = await QRToken.findOne({
        user: user._id,
        mealType: meal,
        used: false,
        expiresAt: { $gt: new Date() }
    });

    if (existingToken) {
        const qrImage = await QRCode.toDataURL(existingToken.token);
        return res.render("student/attendance", {
            user,
            qrImage,
            meal,
            expiresAt: existingToken.expiresAt,
            token: existingToken.token
        });
    }


    const qrToken = new QRToken({
        user: user._id,
        mealType: meal,
        plateType,
        token,
        expiresAt
    });

    await qrToken.save();

    const qrImage = await QRCode.toDataURL(token);
    console.log(user);

    console.log(qrToken);
    console.log(token)

    res.render("student/attendance", {
        user,
        qrImage,
        meal,
        expiresAt,
        token: existingToken ? existingToken.token : token
    });
}));

router.get("/qr-status/:token", async (req, res) => {
    const { token } = req.params;

    const qrToken = await QRToken.findOne({ token });

    if (!qrToken) {
        return res.json({ status: "invalid" });
    }

    if (qrToken.used) {
        return res.json({ status: "used" });
    }

    return res.json({ status: "pending" });
});


module.exports = router;
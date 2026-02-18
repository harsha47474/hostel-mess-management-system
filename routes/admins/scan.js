const express = require('express');
const router = express.Router();
const isLoggedIn = require('../../middlewares/isLoggedIn').isLoggedIn;
const isAdmin = require('../../middlewares/isAdmin').isAdmin;
const wrapAsync = require('../../utils/wrapAsync')
const QRToken = require('../../models/qrToken');
const Attendance = require('../../models/attendance');


router.get("/scan", isLoggedIn, isAdmin, (req, res) => {
    const user = req.user;
    res.render("admin/scan", { user });
});


router.post(
    "/scan",
    isLoggedIn,
    isAdmin,
    wrapAsync(async (req, res) => {

        const { token } = req.body;

        if (!token) {
            return res.json({
                success: false,
                message: "Invalid QR Code"
            });
        }

        const qrToken = await QRToken.findOne({ token }).populate("user");

        if (!qrToken) {
            return res.json({
                success: false,
                message: "QR not found"
            });
        }

        if (qrToken.used) {
            return res.json({
                success: false,
                message: "QR already used"
            });
        }

        if (qrToken.expiresAt < new Date()) {
            return res.json({
                success: false,
                message: "QR expired"
            });
        }

        // Check if attendance already marked today
        const now = new Date();

        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);

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

            return res.json({
                success: false,
                message: "Attendance already marked"
            });
        }

        // Create attendance
        await Attendance.create({
            user: qrToken.user._id,
            mealType: qrToken.mealType,
            plateType: qrToken.plateType,
            date: new Date()
        });

        // Mark token used
        qrToken.used = true;
        await qrToken.save();

        return res.json({
            success: true,
            student: qrToken.user.username,
            meal: qrToken.mealType,
            plate: qrToken.plateType
        });

    })
);



module.exports = router;
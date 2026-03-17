const express = require('express');
const router = express.Router();
const isLoggedIn = require('../../middlewares/isLoggedIn').isLoggedIn;
const isAdmin = require('../../middlewares/isAdmin').isAdmin;
const wrapAsync = require('../../utils/wrapAsync')
const QRToken = require('../../models/qrToken');
const Attendance = require('../../models/attendance');
const Activity = require('../../models/activity');

function startOfDay(date = new Date()) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

async function logScan({ req, qrToken, status, reason, message }) {
    const now = new Date();

    const student = qrToken?.user || null;
    const mealType = qrToken?.mealType || null;

    try {
        await Activity.create({
            action: "qr_scan",
            type: "scan",
            performedBy: req.user?.username,
            target: student?.username || "unknown",

            studentId: student?._id,
            studentName: student?.username,
            mealType,

            scanStatus: status,
            reason,

            scannedAt: now,
            scanDate: startOfDay(now),

            scannerId: req.user?._id,
            scannerName: req.user?.username,

            metadata: {
                message,
                tokenProvided: Boolean(req.body?.token),
                tokenId: qrToken?._id,
                tokenUsed: qrToken?.used,
                tokenExpiresAt: qrToken?.expiresAt,
                route: "/admins/scan"
            }
        });
    } catch (e) {
        // Never block scanning because logging failed
        console.error("Scan audit log failed:", e?.message || e);
    }
}

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
            await logScan({
                req,
                qrToken: null,
                status: "rejected",
                reason: "invalid_qr",
                message: "Invalid QR Code"
            });
            return res.json({
                success: false,
                message: "Invalid QR Code"
            });
        }

        const qrToken = await QRToken.findOne({ token }).populate("user");

        if (!qrToken) {
            await logScan({
                req,
                qrToken: null,
                status: "rejected",
                reason: "qr_not_found",
                message: "QR not found"
            });
            return res.json({
                success: false,
                message: "QR not found"
            });
        }

        if (qrToken.used) {
            await logScan({
                req,
                qrToken,
                status: "duplicate",
                reason: "already_used",
                message: "QR already used"
            });
            return res.json({
                success: false,
                message: "QR already used"
            });
        }

        if (qrToken.expiresAt < new Date()) {
            await logScan({
                req,
                qrToken,
                status: "rejected",
                reason: "expired_qr",
                message: "QR expired"
            });
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

            await logScan({
                req,
                qrToken,
                status: "duplicate",
                reason: "already_scanned",
                message: "Attendance already marked"
            });
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

        await logScan({
            req,
            qrToken,
            status: "accepted",
            reason: null,
            message: "Attendance marked"
        });
        return res.json({
            success: true,
            student: qrToken.user.username,
            meal: qrToken.mealType,
            plate: qrToken.plateType
        });

    })
);



module.exports = router;
const express = require("express");
const router = express.Router();

const isLoggedIn = require("../../middlewares/isLoggedIn").isLoggedIn;
const isAdmin = require("../../middlewares/isAdmin").isAdmin;
const wrapAsync = require("../../utils/wrapAsync");

const Activity = require("../../models/activity");
const Attendance = require("../../models/attendance");
const User = require("../../models/user");
const getCurrentMeal = require("../../utils/getCurrentMeal");

function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

async function getTodayScanStats() {
  const today = startOfDay(new Date());

  const [total, accepted, rejected, duplicate] = await Promise.all([
    Activity.countDocuments({ type: "scan", scanDate: today }),
    Activity.countDocuments({ type: "scan", scanDate: today, scanStatus: "accepted" }),
    Activity.countDocuments({ type: "scan", scanDate: today, scanStatus: "rejected" }),
    Activity.countDocuments({ type: "scan", scanDate: today, scanStatus: "duplicate" })
  ]);

  const mealWise = await Activity.aggregate([
    { $match: { type: "scan", scanDate: today, scanStatus: "accepted" } },
    { $group: { _id: "$mealType", count: { $sum: 1 } } }
  ]);

  const mealCounts = { Breakfast: 0, Lunch: 0, Dinner: 0 };
  mealWise.forEach((m) => {
    if (m?._id && mealCounts[m._id] !== undefined) mealCounts[m._id] = m.count;
  });

  return { today, total, accepted, rejected, duplicate, mealCounts };
}

async function getRecentScanLogs(limit = 20) {
  return await Activity.find({ type: "scan" })
    .sort({ scannedAt: -1, createdAt: -1 })
    .limit(limit);
}

async function getAverageWeeklyStudents(weeksBack = 6) {
  // Average unique students per ISO week based on accepted scans
  const from = new Date();
  from.setDate(from.getDate() - weeksBack * 7);

  const weekly = await Activity.aggregate([
    {
      $match: {
        type: "scan",
        scanStatus: "accepted",
        scannedAt: { $gte: from },
        studentId: { $ne: null }
      }
    },
    {
      $group: {
        _id: { year: { $isoWeekYear: "$scanDate" }, week: { $isoWeek: "$scanDate" } },
        students: { $addToSet: "$studentId" }
      }
    },
    { $project: { _id: 1, uniqueStudents: { $size: "$students" } } },
    { $sort: { "_id.year": -1, "_id.week": -1 } }
  ]);

  if (!weekly.length) return { average: 0, weeklyBreakdown: [] };

  const sum = weekly.reduce((acc, w) => acc + (w.uniqueStudents || 0), 0);
  const avg = Math.round((sum / weekly.length) * 10) / 10;

  return { average: avg, weeklyBreakdown: weekly };
}

async function getMissedMealStudentsToday() {
  // Only if we can infer an "eligible" population. We'll use active messStatus with non-expired subscription.
  const mealType = getCurrentMeal();
  if (!mealType) return { mealType: null, missedCount: null, sample: [] };

  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const eligibleStudents = await User.find({
    role: "student",
    messStatus: "active",
    "messSubscription.endDate": { $gte: todayStart }
  }).select("_id username");

  if (!eligibleStudents.length) return { mealType, missedCount: 0, sample: [] };

  const attended = await Attendance.find({
    mealType,
    date: { $gte: todayStart, $lte: todayEnd }
  }).select("user");

  const attendedSet = new Set(attended.map((a) => String(a.user)));
  const missed = eligibleStudents.filter((s) => !attendedSet.has(String(s._id)));

  return {
    mealType,
    missedCount: missed.length,
    sample: missed.slice(0, 10).map((s) => ({ id: s._id, username: s.username }))
  };
}

router.get(
  "/analytics",
  isLoggedIn,
  isAdmin,
  wrapAsync(async (req, res) => {
    const [stats, recentLogs, avgWeekly, missed] = await Promise.all([
      getTodayScanStats(),
      getRecentScanLogs(20),
      getAverageWeeklyStudents(8),
      getMissedMealStudentsToday()
    ]);

    res.render("admin/analytics", {
      user: req.user,
      stats,
      recentLogs,
      avgWeekly,
      missed
    });
  })
);

router.get(
  "/audit-logs",
  isLoggedIn,
  isAdmin,
  wrapAsync(async (req, res) => {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = 50;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      Activity.find({ type: "scan" }).sort({ scannedAt: -1, createdAt: -1 }).skip(skip).limit(limit),
      Activity.countDocuments({ type: "scan" })
    ]);

    const totalPages = Math.max(Math.ceil(total / limit), 1);

    res.render("admin/auditLogs", {
      user: req.user,
      logs,
      page,
      totalPages,
      total
    });
  })
);

module.exports = router;


const express = require("express");
const router = express.Router();

const isLoggedIn = require("../../middlewares/isLoggedIn").isLoggedIn;
const isAdmin = require("../../middlewares/isAdmin").isAdmin;
const wrapAsync = require("../../utils/wrapAsync");

const Complaint = require("../../models/complaints");
const Activity = require("../../models/activity");

router.get("/complaints", isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
  const { status, category, q } = req.query;

  const filter = {};
  if (status && ["pending", "in-progress", "resolved"].includes(status)) filter.status = status;
  if (category && ["Food", "Hygiene", "Billing", "Other"].includes(category)) filter.category = category;

  if (q && q.trim().length) {
    filter.$or = [
      { title: { $regex: q.trim(), $options: "i" } },
      { description: { $regex: q.trim(), $options: "i" } },
    ];
  }

  const complaints = await Complaint.find(filter)
    .populate("student", "name username")
    .sort({ createdAt: -1 });

  const totalComplaints = await Complaint.countDocuments();

  res.render("admin/complaints.ejs", {
    user: req.user,
    totalComplaints,
    pendingCount: await Complaint.countDocuments({ status: "pending" }),
    progressCount: await Complaint.countDocuments({ status: "in-progress" }),
    resolvedCount: await Complaint.countDocuments({ status: "resolved" }),
    complaints,
    filters: { status: status || "", category: category || "", q: q || "" }
  });
}));

// update (modal submit)
router.put("/complaints/:id", isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
  const { status, adminNote } = req.body;

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.redirect("/admin/complaints");

  if (status && ["pending", "in-progress", "resolved"].includes(status)) {
    complaint.status = status;
  }

  complaint.adminNote = typeof adminNote === "string" ? adminNote : complaint.adminNote;
  complaint.handledBy = req.user._id;

  if (complaint.status === "resolved") complaint.resolvedAt = new Date();

  await complaint.save();

  await Activity.create({
    action: `updated complaint (${complaint.status})`,
    performedBy: req.user.username,
    target: `Complaint: ${complaint.title}`,
    type: "complaint"
  });

  res.redirect("/admins/complaints");
}));

module.exports = router;
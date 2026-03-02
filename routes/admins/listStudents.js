const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const wrapAsync = require('../../utils/wrapAsync');
const isAdmin = require('../../middlewares/isAdmin').isAdmin;
const isLoggedIn = require('../../middlewares/isLoggedIn').isLoggedIn;
const passportLocalMongoose = require('passport-local-mongoose');
const expressError = require('../../utils/expressErrors');
const ExpressError = require('../../utils/expressErrors');
const Activity = require('../../models/activity')


// GET All Students
router.get("/students", isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
  try {
    const { search, filter } = req.query;

    let query = { role: "student" };

    // 🔍 Search logic
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    let students = await User.find(query).sort({ createdAt: -1 });

    const today = new Date();

    // 🔽 Filter logic
    if (filter === "active") {
      students = students.filter(s => s.messStatus === "active");
    }

    if (filter === "expired") {
      students = students.filter(s =>
        s.messSubscription?.endDate &&
        new Date(s.messSubscription.endDate) < today
      );
    }

    if (filter === "expiring") {
      students = students.filter(s => {
        if (!s.messSubscription?.endDate) return false;
        const diffDays =
          (new Date(s.messSubscription.endDate) - today) /
          (1000 * 60 * 60 * 24);

        return diffDays > 0 && diffDays <= 7;
      });
    }

    res.render("admin/manageStudent/students.ejs", {
      user: req.user,
      students,
      search,
      filter
    });

  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong");
    res.redirect("/admins/dashboard");
  }
}));


// add student
router.post("/students/add", isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
  try {
    const { username, email, password, rollNumber, foodPreference } = req.body;

    const newStudent = new User({
      username,
      email,
      rollNumber,
      role: "student",
      foodPreference,
      messStatus: "inactive", // ✅ default
      messSubscription: {}
    });

    const registeredStudent = await User.register(newStudent, password);

    // 🔥 LOG ACTIVITY
    await Activity.create({
      action: "added student",
      performedBy: req.user.username,
      target: username,
      type: "student"
    });

    req.flash("success", "Student added successfully");
    res.redirect("/admins/students");

  } catch (err) {
    console.log(err);
    req.flash("error", err.message);
    res.redirect("/admins/students");
  }
}));


// edit route
router.post("/students/update/:id", isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
  try {
    const { username, email, foodPreference, endDate } = req.body;

    const student = await User.findById(req.params.id);

    if (!student) {
      req.flash("error", "Student not found");
      return res.redirect("/admins/students");
    }

    // ✅ Only allowed fields
    student.username = username;
    student.email = email;
    student.foodPreference = foodPreference;

    // ✅ Update expiry if provided
    if (endDate) {
      student.messSubscription = student.messSubscription || {};
      student.messSubscription.endDate = new Date(endDate);
    }

    await student.save();

    req.flash("success", "Student updated successfully");
    res.redirect("/admins/students");

  } catch (err) {
    console.log(err);
    req.flash("error", "Update failed");
    res.redirect("/admins/students");
  }
}));


// Delete Route
router.post("/students/delete/:id", isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    const student = await User.findById(req.params.id);

    await Activity.create({
      action: "deleted student",
      performedBy: req.user.username,
      target: student.username,
      type: "student"
    });

    await User.findByIdAndDelete(req.params.id);
    req.flash("success", "Student deleted successfully");
    res.redirect("/admins/students");
  } catch (err) {
    req.flash("error", "Delete failed");
    res.redirect("/admins/students");
  }
}));

module.exports = router;
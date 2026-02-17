const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const wrapAsync = require('../../utils/wrapAsync');
const isAdmin = require('../../middlewares/isAdmin').isAdmin;
const isLoggedIn = require('../../middlewares/isLoggedIn').isLoggedIn;
const passportLocalMongoose = require('passport-local-mongoose');
const Complaint = require('../../models/complaints');


router.get('/students', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
  const students = await User.find({ role: 'student' });
  res.render('admin/students.ejs', { user: req.user, students });
}));

router.get('/students/new', isLoggedIn, isAdmin, (req, res) => {
  res.render('admin/newStudent.ejs', { user: req.user });
});

router.post('/students', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
    let {username , email , rollNumber} = req.body
    const newUser = new User({ username, email, rollNumber, role: 'student' });
    console.log(req.body);
    await User.register(newUser, req.body.password);
    res.redirect('/admins/students');
}));

router.get('/students/:id/edit', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
  const student = await User.findById(req.params.id);
  res.render("admin/editStudent.ejs", { user: req.user, student });
}));

router.put('/students/:id', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
  const { username, email, rollNumber } = req.body;
  await User.findByIdAndUpdate(req.params.id, { username, email, rollNumber });
  res.redirect("/admins/students");
}));


router.delete('/students/:id', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Complaint.deleteMany({ student: id });
  await User.findByIdAndDelete(id);
  res.redirect('/admins/students');
}));
module.exports = router;
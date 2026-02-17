const exprees = require('express');
const router = exprees.Router();
const isLoggedIn = require('../../middlewares/isLoggedIn').isLoggedIn;
const isStudent = require('../../middlewares/isStudent').isStudent;
const Bill = require('../../models/bills');
const Attendance = require('../../models/attendance');
const wrapAsync = require('../../utils/wrapAsync');

router.get("/dashboard", isLoggedIn, isStudent, wrapAsync(async (req, res) => {
   


    res.render("student/dashboard.ejs", { user: req.user});
}));


module.exports = router;
const express = require('express');
const router = express.Router();
const isLoggedIn = require('../../middlewares/isLoggedIn').isLoggedIn;
const isStudent = require('../../middlewares/isStudent').isStudent;
const wrapAsync = require('../../utils/wrapAsync');
const Attendance = require('../../models/attendance');
const Bill = require('../../models/bills');

router.get('/billing', isLoggedIn, isStudent, wrapAsync(async (req, res) => {

}));



module.exports = router;
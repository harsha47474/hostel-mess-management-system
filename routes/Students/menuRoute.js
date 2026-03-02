const express = require('express');
const router = express.Router();
const isLoggedIn = require('../../middlewares/isLoggedIn').isLoggedIn;
const isStudent = require('../../middlewares/isStudent').isStudent;
const menuSchema = require("../../models/menu");
const wrapAsync = require('../../utils/wrapAsync');


router.get('/menu', isLoggedIn, isStudent, wrapAsync(async (req, res) => {
  const user = req.user;  
  const userPref = req.user.foodPreference; 
  const menus = await menuSchema.find().sort({ day: 1 });
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  
  res.render('student/menu', { user, menus, userPref, today });
}));
module.exports = router;
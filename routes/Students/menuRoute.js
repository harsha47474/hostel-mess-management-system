const express = require('express');
const router = express.Router();
const isLoggedIn = require('../../middlewares/isLoggedIn').isLoggedIn;
const isStudent = require('../../middlewares/isStudent').isStudent;
const menuSchema = require("../../models/menu");
const wrapAsync = require('../../utils/wrapAsync');

router.get('/menu', isLoggedIn, isStudent, wrapAsync(async (req, res) => {
    const menu = await menuSchema.find({});
    res.render('student/menu.ejs', { user: req.user, menu: menu ,active:"menu"});
}));

module.exports = router;
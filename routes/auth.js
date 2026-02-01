const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync = require('../utils/wrapAsync');
const User = require('../models/user');

// Login route
router.get('/login', (req, res) => {
    res.render('auth/login.ejs');
});

//post route for login
router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), (req, res) => {
    if (req.user.role === 'admin') {
        return res.redirect('/admin/dashboard');
    } else if (req.user.role === 'student') {
        return res.redirect('/students/dashboard');
    }
});

module.exports = router;
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


//logout route
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            req.flash('error', 'Logout failed');
            return res.redirect('/login');
        }
        req.flash('success', 'You have been logged out');
        res.redirect('/login');
    });
});

module.exports = router;
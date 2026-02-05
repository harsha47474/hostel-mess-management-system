const express = require('express');
const router = express.Router();
const isLoggedIn = require('../../middlewares/isLoggedIn').isLoggedIn;
const isStudent = require('../../middlewares/isStudent').isStudent;
const wrapAsync = require('../../utils/wrapAsync');
const Complaint = require('../../models/complaints');


router.get('/complaints', isLoggedIn, isStudent, wrapAsync(async (req, res) => {
    const complaints = await Complaint.find({ student: req.user._id }).sort({ createdAt: -1 });
    res.render('student/complaints.ejs', { user: req.user, complaints });
}));

// POST new complaint
router.post('/complaints', isLoggedIn, isStudent, wrapAsync(async (req, res) => {
    const { title, category, description } = req.body;

    await Complaint.create({
        student: req.user._id,
        title,
        category,
        description
    });

    res.redirect('/student/complaints');
}));

router.delete('/complaints/:id', isLoggedIn, isStudent, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Complaint.findOneAndDelete({ _id: id, student: req.user._id });
    res.redirect('/student/complaints');
}));

module.exports = router;

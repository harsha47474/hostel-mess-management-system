const exprees = require('express');
const router = exprees.Router();
const isLoggedIn = require('../../middlewares/isLoggedIn').isLoggedIn;
const isStudent = require('../../middlewares/isStudent').isStudent;

router.get("/dashboard", isLoggedIn, isStudent, (req,res)=>{
    res.send("Student Dashboard");
})

module.exports = router;
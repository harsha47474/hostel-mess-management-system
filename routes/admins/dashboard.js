const exprees = require('express');
const router = exprees.Router();
const isLoggedIn = require('../../middlewares/isLoggedIn').isLoggedIn;
const isAdmin = require('../../middlewares/isAdmin').isAdmin;

router.get("/dashboard", isLoggedIn , isAdmin, (req,res)=>{
    res.send("Admin Dashboard");
})

module.exports = router;
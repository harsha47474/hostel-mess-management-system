module.exports.isStudent = (req,res,next)=>{
    if(req.isAuthenticated() && req.user.role === 'student'){
        return next();
    }
    req.flash('error', 'You must be a student to access this page');
    res.redirect('/login');
};
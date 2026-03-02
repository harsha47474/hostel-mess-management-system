module.exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  req.flash('error', 'You must be an admin to access this page');
  res.redirect('/login');
}

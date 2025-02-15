// middlewares/ensureAuthenticated.js
module.exports = function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    req.flash('error', 'Please login first');
    res.redirect('/admin/login');
  };
  
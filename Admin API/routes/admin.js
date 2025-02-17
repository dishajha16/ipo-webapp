// routes/admin.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const IPO = require('../models/IPO');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const { formatDate } = require('../helpers/dateHelpers');
const { getStatusColor } = require('../helpers/statusHelpers');
const multer = require('multer');
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB file size limit
});

// Admin Login Routes
router.get('/login', (req, res) => {
  console.log('GET /admin/login - Rendering login page...');
  
  // Simulate a flash error message for testing purposes
  const flashError = req.flash('error');
  console.log('Flash error messages:', flashError);
  
  // Render the admin_login.ejs file and pass the flash message
  res.render('listings/admin_login.ejs', { error: flashError });
});

router.post('/login', (req, res, next) => {
  console.log('POST /admin/login - Authenticating user...');
  
  passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/admin/login',
    failureFlash: true
  })(req, res, next);
});
// router.get('/logout', (req, res) => { req.logout(); res.redirect('/admin/login'); });

// Dashboard Route
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    const totalIPO = await IPO.countDocuments(),
      ipoOngoing = 16,
      ipoNewListed = 10 ,
      ipoComing = 6;
    const ipoLoss = 6,
      ipoGain = totalIPO - ipoLoss;
    let boardStartDate = 'N/A';
    const earliestIPO = await IPO.findOne().sort({ listingDate: 1 }).exec();
    if (earliestIPO && earliestIPO.listingDate)
      boardStartDate = earliestIPO.listingDate.toLocaleDateString('en-GB');
    const dashboardData = {
      description: '',
      totalIPO,
      ipoGain,
      ipoLoss,
      boardStartDate,
      quickLinks: [
        { shortName: 'NSE', name: 'NSE India', bgColor: '#fee2e2', url: 'https://www.nseindia.com' },
        { shortName: 'BSE', name: 'BSE India', bgColor: '#e0e7ff', url: 'https://www.bseindia.com' },
        { shortName: 'SEBI', name: 'SEBI', bgColor: '#dcfce7', url: 'https://www.sebi.gov.in' },
        { shortName: 'MC', name: 'Money Control', bgColor: '#f3e8ff', url: 'https://www.moneycontrol.com' }
      ],
      chartLabels: ['Upcoming', 'New Listed', 'Ongoing'],
      chartData: [ipoComing, ipoNewListed, ipoOngoing],
      chartColors: ['#8495ec', '#586acb', '#c7ccff'],
      chartLegend: [
        { label: 'Upcoming', count: ipoComing, color: '#8495ec' },
        { label: 'New Listed', count: ipoNewListed, color: '#586acb' },
        { label: 'Ongoing', count: ipoOngoing, color: '#c7ccff' }
      ]
    };
    const page = parseInt(req.query.page) || 1,
      limit = 10,
      skip = (page - 1) * limit;
    const ipos = await IPO.find().sort({ listingDate: -1 }).skip(skip).limit(limit);
    const totalIpos = await IPO.countDocuments(),
      totalPages = Math.ceil(totalIpos / limit);
    res.render('listings/nav.ejs', {
      user: req.user,
      dashboardData,
      ipos,
      currentPage: page,
      totalPages,
      formatDate,
      getStatusColor
    });
  } catch (error) {
    console.error('Error rendering dashboard:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Upcoming IPO Route
router.get('/upcoming-ipo', ensureAuthenticated, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1,
      limit = 10,
      skip = (page - 1) * limit;
    const totalIpos = await IPO.countDocuments();
    const totalPages = Math.ceil(totalIpos / limit);
    const ipos = await IPO.find().sort({ listingDate: -1 }).skip(skip).limit(limit);
    res.render('listings/upcoming-ipo', { ipos, currentPage: page, totalPages, totalIpos, user: req.user, formatDate, getStatusColor });
  } catch (error) {
    console.error('Error fetching IPOs:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;





const mongoose = require('mongoose');

// Middleware to handle async errors
function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}

// Route to edit an IPO listing
router.get(
  '/ipo/edit/:id',
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send('Invalid ID');
    }
    const ipo = await IPO.findById(id);
    if (!ipo) {
      return res.status(404).send('IPO not found');
    }
    res.render('includes/update.ejs', { ipo });
  })
);


router.put(
  "/ipo/edit/:id",
  upload.single('logo'), // process the file upload from field 'logo'
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await IPO.findByIdAndUpdate(id, { ...req.body });
    console.log(req.body);
    res.redirect(`/admin/dashboard`);
  })
);



router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/admin/login');
  });
});


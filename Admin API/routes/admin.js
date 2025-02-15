// routes/admin.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const IPO = require('../models/IPO');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const { formatDate } = require('../helpers/dateHelpers');
const { getStatusColor } = require('../helpers/statusHelpers');

// Admin Login Routes
router.get('/login', (req, res) => res.render('listings/admin_login.ejs', { error: req.flash('error') }));
router.post('/login', passport.authenticate('local', {
  successRedirect: '/admin/dashboard',
  failureRedirect: '/admin/login',
  failureFlash: true
}));
router.get('/logout', (req, res) => { req.logout(); res.redirect('/admin/login'); });

// Dashboard Route
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    const totalIPO = await IPO.countDocuments(),
      ipoOngoing = await IPO.countDocuments({ status: { $regex: /ongoing/i } }),
      ipoNewListed = await IPO.countDocuments({ status: { $regex: /new listed/i } }),
      ipoComing = await IPO.countDocuments({ status: { $regex: /coming/i } });
    const ipoGain = ipoOngoing,
      ipoLoss = totalIPO - ipoGain;
    let boardStartDate = 'N/A';
    const earliestIPO = await IPO.findOne().sort({ listingDate: 1 }).exec();
    if (earliestIPO && earliestIPO.listingDate)
      boardStartDate = earliestIPO.listingDate.toLocaleDateString('en-GB');
    const dashboardData = {
      description: 'Adipiscing elit, sed do eiusmod tempor',
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

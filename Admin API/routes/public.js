// routes/public.js
const express = require('express');
const router = express.Router();
const IPO = require('../models/IPO');
const { formatDate } = require('../helpers/dateHelpers');

// Listings page
router.get('/listings', async (req, res) => {
  try {
    const ipoList = await IPO.find({});
    const formattedIPOs = ipoList.map(ipo => ({
      ...ipo.toObject(),
      open: formatDate(ipo.open),
      close: formatDate(ipo.close),
      listingDate: formatDate(ipo.listingDate),
      listedDate: formatDate(ipo.listedDate)
    }));
    res.render('listings/ipo_listing.ejs', { ipoList: formattedIPOs, error: req.flash('error') });
  } catch (error) {
    console.error('Error fetching IPOs:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Other public pages
router.get('/community', (req, res) => res.render('listings/community.ejs', { error: req.flash('error') }));
router.get('/support', (req, res) => res.render('listings/support.ejs', { error: req.flash('error') }));
router.get('/signup', (req, res) => res.render('listings/signup.ejs', { error: req.flash('error') }));
router.get('/investors', (req, res) => res.render('listings/Shark_Investors.ejs', { error: req.flash('error') }));
router.get('/brokers', (req, res) => res.render('listings/brokers.ejs', { error: req.flash('error') }));


// IPO submission route
router.post('/admin/ipo/new', async (req, res) => {
  try {
    const parseDate = dateStr => dateStr ? new Date(dateStr) : undefined;
    const newIPO = new IPO({
      companyName: req.body.companyName,
      logo: req.body.logo || '/placeholder-logo.png',
      priceBand: req.body.priceBand,
      open: parseDate(req.body.open),
      close: parseDate(req.body.close),
      issueSize: req.body.issueSize,
      issueType: req.body.issueType,
      listingDate: parseDate(req.body.listingDate),
      status: req.body.status,
      ipoPrice: req.body.ipoPrice,
      listingPrice: req.body.listingPrice,
      listingGain: req.body.listingGain,
      listedDate: parseDate(req.body.listedDate),
      cmp: req.body.cmp,
      currentReturn: req.body.currentReturn,
      rhp: req.body.rhp,
      drhp: req.body.drhp
    });
    await newIPO.save();
    res.redirect('/listings');
  } catch (error) {
    console.error('IPO Save Error:', error);
    res.status(500).send(`Error: ${error.message}`);
  }
});

module.exports = router;

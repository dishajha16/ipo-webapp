// routes/api.js
const express = require('express');
const router = express.Router();
const IPO = require('../models/IPO');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

// Get paginated IPO data
router.get('/ipos', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1,
      limit = 10,
      skip = (page - 1) * limit;
    const ipos = await IPO.find().sort({ listingDate: -1 }).skip(skip).limit(limit);
    const total = await IPO.countDocuments();
    res.json({ ipos, currentPage: page, totalPages: Math.ceil(total / limit), total });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get paginated IPO subscription data
router.get('/ipoSubscriptions', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1,
      limit = 10,
      skip = (page - 1) * limit;
    const subscriptions = await IPO.find().sort({ listingDate: -1 }).skip(skip).limit(limit);
    const total = await IPO.countDocuments();
    res.json({ subscriptions, currentPage: page, totalPages: Math.ceil(total / limit), total });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single IPO by ID
router.get('/ipos/:id', async (req, res) => {
  try {
    const ipo = await IPO.findById(req.params.id);
    if (!ipo) return res.status(404).json({ error: 'IPO not found' });
    res.json(ipo);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update IPO (protected)
router.put('/ipos/:id', ensureAuthenticated, async (req, res) => {
  try {
    const ipo = await IPO.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ipo) return res.status(404).json({ error: 'IPO not found' });
    res.json(ipo);
  } catch (error) {
    console.error('Error updating IPO:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Delete IPO (protected)
router.delete('/ipos/:id', ensureAuthenticated, async (req, res) => {
  try {
    const ipo = await IPO.findByIdAndDelete(req.params.id);
    if (!ipo) return res.status(404).json({ error: 'IPO not found' });
    res.json({ message: 'IPO deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

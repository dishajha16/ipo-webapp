// routes/management.js
const express = require('express');
const router = express.Router();
const Api = require('../models/Api');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

// Get all APIs
router.get('/apis', ensureAuthenticated, async (req, res) => {
  try {
    const apis = await Api.find();
    res.json(apis);
  } catch (error) {
    console.error('Error fetching APIs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new API
router.post('/apis', ensureAuthenticated, async (req, res) => {
  try {
    const newApi = new Api(req.body);
    await newApi.save();
    res.json(newApi);
  } catch (error) {
    console.error('Error creating API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update an existing API
router.put('/apis/:id', ensureAuthenticated, async (req, res) => {
  try {
    const updatedApi = await Api.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: Date.now() }, { new: true });
    if (!updatedApi) return res.status(404).json({ error: 'API not found' });
    res.json(updatedApi);
  } catch (error) {
    console.error('Error updating API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete an API
router.delete('/apis/:id', ensureAuthenticated, async (req, res) => {
  try {
    const deletedApi = await Api.findByIdAndDelete(req.params.id);
    if (!deletedApi) return res.status(404).json({ error: 'API not found' });
    res.json({ message: 'API deleted successfully' });
  } catch (error) {
    console.error('Error deleting API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

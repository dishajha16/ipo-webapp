// models/IPO.js
const mongoose = require('mongoose');
const ipoSchema = new mongoose.Schema({
  companyName: String,
  logo: { type: String, default: '/placeholder-logo.png' },
  priceBand: String,
  open: Date,
  close: Date,
  issueSize: String,
  issueType: String,
  listingDate: Date,
  status: String,
  ipoPrice: String,
  listingPrice: String,
  listingGain: String,
  listedDate: Date,
  cmp: String,
  currentReturn: String,
  rhp: String,
  drhp: String
});
module.exports = mongoose.model('IPO', ipoSchema);

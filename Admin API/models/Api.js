// models/Api.js
const mongoose = require('mongoose');
const apiSchema = new mongoose.Schema({
  name: String,
  endpoint: String,
  method: String,
  responseStatus: { type: Number, default: 200 },
  responseType: String,
  responseFile: String,
  templateFile: String,
  templateContent: String,
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Api', apiSchema);

const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false } // Add this field
  });
  

module.exports = mongoose.model('Otp', otpSchema);

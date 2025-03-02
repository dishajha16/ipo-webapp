const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const Otp = require('../models/otp');
const { sendOTP } = require('../utils/emailService');

const router = express.Router();

// Generate and send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Save OTP to database
    await Otp.findOneAndUpdate({ email }, { otp, createdAt: Date.now() }, { upsert: true });

    // Send OTP via email
    await sendOTP(email, otp);

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find the stored OTP
    const storedOtp = await Otp.findOne({ email });
    if (!storedOtp || storedOtp.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP or expired' });
    }

    // Mark OTP as verified
    storedOtp.isVerified = true;
    await storedOtp.save();

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error in /auth/verify-otp:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    console.log('Received reset password request:', { email, newPassword });

    // Validate input
    if (!email || !newPassword) {
      console.error('Validation failed: Missing email or newPassword');
      return res.status(400).json({ error: 'Email and newPassword are required' });
    }
    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      console.error('Validation failed: Invalid newPassword');
      return res.status(400).json({ error: 'Password must be a string with at least 8 characters' });
    }

    // Check if OTP was verified recently
    const storedOtp = await Otp.findOne({ email });
    if (!storedOtp || !storedOtp.isVerified) {
      console.error('Validation failed: OTP verification required');
      return res.status(400).json({ message: 'OTP verification required' });
    }

    const OTP_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
    // Check if OTP has expired
    const currentTime = Date.now();
    if (currentTime - storedOtp.createdAt > OTP_EXPIRATION_TIME) {
      console.error('Validation failed: OTP expired');
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Find user and update password
    const user = await User.findOne({ email });
    if (!user) {
      console.error('Validation failed: User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Clear the OTP after successful password reset
    await Otp.deleteOne({ email });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error in /auth/reset-password:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

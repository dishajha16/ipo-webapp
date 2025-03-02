const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google OAuth users
  googleId: { type: String, unique: true, sparse: true }, // For Google OAuth users
  photo: { type: String }, // Profile picture URL from Google
  confirmationToken: String,
  isVerified: { type: Boolean, default: false }
  //... other fields you might need for public users...
});

module.exports = mongoose.model('User', userSchema);
// models/PublicUser.js
const mongoose = require('mongoose');
const publicUserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmationToken: String,
  isVerified: { type: Boolean, default: false }
  //... other fields you might need for public users...
});
module.exports = mongoose.model('PublicUser', publicUserSchema);
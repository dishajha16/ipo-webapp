// routes/auth.js
const express = require('express');
const router = express.Router();
const PublicUser = require('../models/PublicUser'); // Import the PublicUser model
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Signup route
router.post('/signup', async (req, res) => {
  try {
    console.log("Signup request received:", req.body); // Log the request body

    const { username, email, password } = req.body;

    // Basic validation (add more as needed)
    if (!username ||!email ||!password) {
      req.flash('error', 'All fields are required');
      return res.redirect('/signup'); 
    }

    // Check if user already exists (case-insensitive)
    const existingUser = await PublicUser.findOne({ 
        $or: [
            { username: { $regex: new RegExp(username, 'i') } }, 
            { email: { $regex: new RegExp(email, 'i') } }
        ] 
    });
    if (existingUser) {
      req.flash('error', 'Username or email already exists');
      return res.redirect('/signup'); 
    }

    // Hash the password (using await)
    const hashedPassword = await bcrypt.hash(password, 10); 

    // Create new user
    const newPublicUser = new PublicUser({ 
      username, 
      email, 
      password: hashedPassword 
    });

    // Save the user with detailed error handling
    try {
        await newPublicUser.save(); 
        console.log("New user saved successfully:", newPublicUser); // Log the saved user
        req.flash('success', 'Signup successful! Please login.');
        res.redirect('/login'); 
    } catch (error) {
        console.error('Error saving public user:', error);
        if (error.code === 11000) { // Duplicate key error (username or email)
            if (error.keyPattern.username) {
                req.flash('error', 'Username already exists');
            } else if (error.keyPattern.email) {
                req.flash('error', 'Email already exists');
            } else {
                req.flash('error', 'Username or email already exists');
            }
        } else {
            req.flash('error', 'Signup failed. Please try again later.');
        }
        return res.redirect('/signup'); 
    }

  } catch (error) {
    console.error('Signup error:', error);
    req.flash('error', 'Signup failed');
    res.redirect('/signup'); 
  }
});

// Login route
//... your login route code...

module.exports = router;
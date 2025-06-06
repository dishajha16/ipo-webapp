const express = require('express');
const cors = require('cors');
const methodOverride = require('method-override');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const authRoutes = require('./routes/authRoutes');


// Load configuration files (database & passport)
require('./config/database');
require('./config/passport'); // Ensure this includes Google Strategy setup

// Create Express app
const app = express();

// Middleware Setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Disable caching for all responses
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate'); // HTTP 1.1.
  res.set('Pragma', 'no-cache'); // HTTP 1.0.
  res.set('Expires', '0'); // Proxies.
  next();
});


// EJS Setup
app.engine('ejs', require('ejs-mate'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session, Passport, and Flash Setup
app.use(session({
  secret: 'securepassword',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to `true` in production with HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Middleware to Log Requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Flash Messages Middleware
app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.user = req.user; // Make user available in templates
  next();
});

// Public API Handling Middleware (loads dynamic API responses)
const apiHandler = require('./routes/apiHandler');
app.use(apiHandler);

// Load Routes
app.use('/', require('./routes/public'));
app.use('/', require('./routes/auth')); // Add this line to include auth routes
app.use('/api', require('./routes/api'));
app.use('/management', require('./routes/management'));
app.use('/auth', authRoutes);


// Mount Admin Routes
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

// Google OAuth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/admin/login' }),
  (req, res) => {
    // Successful authentication, redirect to /admin/dashboard
    req.flash('success', 'Logged in successfully via Google.');
    res.redirect('/admin/dashboard');
  });

// Start the Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
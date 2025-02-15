// server.js
const express = require('express');
const cors = require('cors');
const methodOverride = require('method-override');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

// Load configuration files (database & passport)
require('./config/database');
require('./config/passport');

// Create Express app
const app = express();

// Create initial admin if not exists
const User = require('./models/User');
const bcrypt = require('bcryptjs');
(async function createInitialAdmin() {
  const existingAdmin = await User.findOne({ username: 'admin' });
  if (!existingAdmin) {
    const hashedPassword = bcrypt.hashSync('admin123', 12);
    await new User({ username: 'admin', password: hashedPassword }).save();
    console.log('Initial admin created');
  }
})();

// Middleware Setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// EJS Setup
app.engine('ejs', require('ejs-mate'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session, Passport, and Flash Setup
app.use(session({
  secret: 'securepassword',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  next();
});

// Public API Handling Middleware (loads dynamic API responses)
const apiHandler = require('./routes/apiHandler');
app.use(apiHandler);

// Load Routes
app.use('/', require('./routes/public'));
app.use('/', require('./routes/auth')); // Add this line to include auth routes
app.use('/admin', require('./routes/admin'));
app.use('/api', require('./routes/api'));
app.use('/management', require('./routes/management'));

// Start the Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

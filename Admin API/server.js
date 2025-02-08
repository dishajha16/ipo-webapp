const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const app = express();

// Database connection
mongoose.connect('mongodb+srv://vinayst:5OLN0a7MMM0MH3zN@bluestock.8icni.mongodb.net/?retryWrites=true&w=majority&appName=Bluestock');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static('public'));

// EJS configuration
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session configuration
app.use(session({
  secret: 'securepassword',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Passport and flash configuration
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Flash messages middleware
app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  next();
});

// Schemas and models
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
  updatedAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

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

const User = mongoose.model('User', userSchema);
const Api = mongoose.model('Api', apiSchema);
const IPO = mongoose.model('IPO', ipoSchema);

// Passport configuration
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    if (!user) return done(null, false, { message: 'Incorrect username.' });
    if (!bcrypt.compareSync(password, user.password)) return done(null, false, { message: 'Incorrect password.' });
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Create initial admin user
async function createInitialAdmin() {
  const existingAdmin = await User.findOne({ username: 'admin' });
  if (!existingAdmin) {
    const hashedPassword = bcrypt.hashSync('admin123', 12);
    const admin = new User({ username: 'admin', password: hashedPassword });
    await admin.save();
    console.log('Initial admin created');
  }
}
createInitialAdmin();

// Public API Handling Middleware
app.use(async (req, res, next) => {
  if (req.path.startsWith('/admin') || req.path.startsWith('/management')) return next();
  try {
    const api = await Api.findOne({
      endpoint: req.path,
      method: req.method,
      active: true,
    });
    if (!api) return next();
    if (api.responseType === 'template') {
      const templatePath = path.join(__dirname, 'templates', api.templateFile);
      if (!fs.existsSync(templatePath)) {
        console.error(`Template file not found: ${templatePath}`);
        return res.status(500).send('Template file not found');
      }
      const content = ejs.render(fs.readFileSync(templatePath, 'utf8'), {
        query: req.query,
        body: req.body,
        params: req.params,
      });
      res.type('html').status(api.responseStatus).send(content);
    } else {
      const filePath = path.join(__dirname, 'responses', api.responseFile);
      if (!fs.existsSync(filePath)) {
        console.error(`Response file not found: ${filePath}`);
        return res.status(500).send('Response file not found');
      }
      const content = fs.readFileSync(filePath, 'utf8');
      res.type(api.responseType).status(api.responseStatus).send(content);
    }
  } catch (error) {
    console.error('API Handling Error:', error);
    res.status(500).send('Error processing request');
  }
});

// Date formatting helper
function formatDate(dateString) {
  if (!dateString || dateString === "Not Issued") return "Not Issued";
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "Not Issued" : date.toLocaleDateString('en-GB').replace(/\//g, '-');
}

// Routes
app.get('/listings', async (req, res) => {
  try {
    const ipoList = await IPO.find({});
    const formattedIPOs = ipoList.map(ipo => ({
      ...ipo.toObject(),
      open: formatDate(ipo.open),
      close: formatDate(ipo.close),
      listingDate: formatDate(ipo.listingDate),
      listedDate: formatDate(ipo.listedDate),
    }));
    res.render('listings/ipo_listing.ejs', { ipoList: formattedIPOs, error: req.flash('error') });
  } catch (error) {
    console.error('Error fetching IPOs:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/community', (req, res) => {
  res.render('listings/community.ejs', { error: req.flash('error') });
});


// Fixed IPO submission route
app.post('/admin/ipo/new', async (req, res) => {
  try {
    console.log('Received IPO data:', req.body);

    const parseDate = (dateStr) => dateStr ? new Date(dateStr) : undefined;

    const newIPO = new IPO({
      companyName: req.body.companyName,
      logo: req.body.logo || '/placeholder-logo.png',
      priceBand: req.body.priceBand,
      open: parseDate(req.body.open),
      close: parseDate(req.body.close),
      issueSize: req.body.issueSize,
      issueType: req.body.issueType,
      listingDate: parseDate(req.body.listingDate),
      status: req.body.status,
      ipoPrice: req.body.ipoPrice,
      listingPrice: req.body.listingPrice,
      listingGain: req.body.listingGain,
      listedDate: parseDate(req.body.listedDate),
      cmp: req.body.cmp,
      currentReturn: req.body.currentReturn,
      rhp: req.body.rhp,
      drhp: req.body.drhp
    });

    await newIPO.save();
    console.log('IPO saved successfully:', newIPO);
    res.redirect('/listings');
  } catch (error) {
    console.error('IPO Save Error:', error.message);
    console.error('Validation Errors:', error.errors);
    res.status(500).send(`Error: ${error.message}`);
  }
});



// Authentication middleware
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  req.flash('error', 'Please login first'); 
  res.redirect('/admin/login');
};

// Route to handle upcoming IPOs (assuming it renders an EJS template)
app.get('/admin/upcomming-ipo', ensureAuthenticated, (req, res) => {
  try {
    // You can fetch data from a database or use static data
    const upcomingIPOs = [
      { company: 'Company A', date: '2023-10-15', price: '$20' },
      { company: 'Company B', date: '2023-10-20', price: '$25' },
    ];
    // Render the EJS template with the data
    res.render('listings/upcoming-ipo.ejs', { user: req.user, upcomingIPOs });
  } catch (error) {
    console.error('Error fetching upcoming IPOs:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Auth routes
app.get('/admin/login', (req, res) => {
  res.render('listings/admin_login.ejs', { error: req.flash('error') });
});

app.post('/admin/login', passport.authenticate('local', {
  successRedirect: '/admin/dashboard',
  failureRedirect: '/admin/login',
  failureFlash: true
}));

app.get('/admin/logout', (req, res) => {
  req.logout();
  res.redirect('/admin/login');
});

// Protected admin routes
app.get('/admin/dashboard', ensureAuthenticated, (req, res) => {
  res.render('listings/nav.ejs', { user: req.user });
});



// Protected management endpoints
app.get('/management/apis', ensureAuthenticated, async (req, res) => {
  try {
    const apis = await Api.find();
    res.json(apis);
  } catch (error) {
    console.error('Error fetching APIs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new API
app.post('/management/apis', ensureAuthenticated, async (req, res) => {
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
app.put('/management/apis/:id', ensureAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Attempting to update API with ID:', id);
    const updatedApi = await Api.findByIdAndUpdate(id, { ...req.body, updatedAt: Date.now() }, { new: true });
    if (!updatedApi) {
      return res.status(404).json({ error: 'API not found' });
    }
    res.json(updatedApi);
  } catch (error) {
    console.error('Error updating API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete an API
app.delete('/management/apis/:id', ensureAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedApi = await Api.findByIdAndDelete(id);
    if (!deletedApi) {
      return res.status(404).json({ error: 'API not found' });
    }
    res.json({ message: 'API deleted successfully' });
  } catch (error) {
    console.error('Error deleting API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Server start
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
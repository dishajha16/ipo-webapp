const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy; // Add Google Strategy
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Local Strategy (for username/password login)
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) return done(null, false, { message: "Incorrect username." });
      if (!bcrypt.compareSync(password, user.password))
        return done(null, false, { message: "Incorrect password." });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: '5422664003-3p9k203bog6o9cndm8pnq0hj19fekhq2.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists in the database
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Generate a unique username for Google OAuth users
          const username = profile.displayName
            .replace(/\s+/g, "_")
            .toLowerCase();

          // Create a new user if not found
          user = new User({
            googleId: profile.id,
            username: username,
            email: profile.emails[0].value,
            photo: profile.photos[0].value,
            isVerified: true, // Automatically verify Google OAuth users
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize and Deserialize User
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

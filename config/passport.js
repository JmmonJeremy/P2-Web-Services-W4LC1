// google auth 
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GoogleTokenStrategy = require('passport-google-token').Strategy; // Import google-token
const mongoose = require('mongoose');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,             
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("Access Token:", accessToken);

        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,        
        }

        try {
          let user = await User.findOne({ googleId: profile.id })         
          if (user) {
            done(null, user)
          } else {
            user = await User.create(newUser)
            done(null, user)
          }
        } catch (err) {
          console.error(err)
        }
      }
    )
  );

  // New Google Token strategy (for token-based authentication needed for .rest requests)
  passport.use(
    new GoogleTokenStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Find or create the user based on the Google profile
          let user = await User.findOne({ googleId: profile.id });
          console.log('Received accessToken After Finding User:', accessToken);
          if (user) {
            return done(null, user);
          } else {
            user = await User.create({
              googleId: profile.id,
              displayName: profile.displayName,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              image: profile.photos[0].value,
            });
            console.log('Received accessToken After Creating User:', accessToken);
            return done(null, user);
          }
        } catch (err) {
          console.log('Received accessToken in Catching error:', accessToken);
          return done(err, null);
        }
      }
    )
  );

  // from https://www.passportjs.org/tutorials/google/session/ 
  // done was used to replace cb (short fro callback) in the code
  passport.serializeUser((user, done) => {
    console.log('Serializing user:', user);
    done(null, user.id)
  });

  passport.deserializeUser(async (id, done) => {
    console.log('Deserializing user with id:', id);
    try {
      const user = await User.findById(id); // Use await to handle the promise
      done(null, user);
    } catch (err) {
      done(err, null); // Pass the error to done if there's an issue
    }
  }); 
}
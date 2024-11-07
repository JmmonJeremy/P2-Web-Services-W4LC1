// google auth 
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,             
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        // console.log(profile);
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        }

        try {
          let user = await User.findOne({ googleId: profile.id })
          console.log(process.env.GOOGLE_CLIENT_ID)
          console.log(process.env.GOOGLE_CLIENT_SECRET) 
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
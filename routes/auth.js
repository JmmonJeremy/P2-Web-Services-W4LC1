// google auth
const express = require('express')
const passport = require('passport')
const routes = express.Router()

// @desc    Auth with Google
// @route   GET /auth/google - from "Authenticate Requests" section
// in https://www.passportjs.org/packages/passport-google-oauth20/
routes.get('/google', passport.authenticate('google', { scope: ['profile'] }))

// @desc    Google auth callback
// @route   GET /auth/google/callback
routes.get(
  '/google/callback',
  (req, res, next) => {
    console.log('Reached Google callback');
    next();
  },
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log('Authentication successful');
    console.log('User authenticated:', req.user); // Check the user object
    res.redirect('/dashboard')
  }
)

// // @desc    Logout user
// // @route   /auth/logout
// routes.get('/logout', (req, res, next) => {
//   req.logout((error) => {
//       if (error) {return next(error)}
//       res.redirect('/')
//   })
// })

module.exports = routes

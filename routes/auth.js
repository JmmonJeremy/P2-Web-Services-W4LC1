// google auth
const express = require('express');
const passport = require('passport');
const routes = express.Router();
const CircularJSON = require('circular-json');

// Custom route for handling authentication failureRedirect
routes.get('/error/401', (req, res) => {
  // Render the error page on authentication failure
  res.status(401).render('error/401');
});

// START ******************************** GOOGLE OAUTH *********************************** START//
// @desc    Auth with Google
// @route   GET /auth/google - from "Authenticate Requests" section
// in https://www.passportjs.org/packages/passport-google-oauth20/
routes.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] })); // added 'email'

// @desc    Google auth callback
// @route   GET /auth/google/callback
routes.get(
  '/google/callback',
  (req, res, next) => { //haven't tested error code on Google
    // console.log("req.query: " + JSON.stringify(req.query, null, 2));
    // req.query.code = 'invalidated_code';
    // console.log("req.query changed to: " + JSON.stringify(req.query, null, 2));
    const authorizationCode = req.query.code;
    
    if (authorizationCode) {
      console.log("A Cookie: connect.sid=" + req.cookies['connect.sid']);
      console.log("Authorization Code:", authorizationCode);
      // You could save this to the session or use it to fetch the access token
    } else {
      console.log("No authorization code found.");
    }
    next();
  },
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {  
    res.status(200).redirect('/dashboard');
  }
);

// END ********************************** GOOGLE OAUTH *********************************** END//
// START ******************************** GITHUB OAUTH *********************************** START//
// @desc    Auth with GitHub
// @route   GET /auth/github - from "Authenticate Requests" section
// in https://www.passportjs.org/packages/passport-github2/
routes.get('/github', passport.authenticate('github', { scope: ['user:email'] })); 

// Set a flag to control whether to clear the session for testing unauthorized responses
const clearSessionForUnauthorized = true; // Toggle this to switch behaviors
// @desc    Google auth callback
// @route   GET /auth/google/callback
routes.get(
  '/github/callback', 
  (req, res, next) => { 
    // console.log("req.query: " + JSON.stringify(req.query, null, 2));
    // req.query.code = 'invalidated_code';
    // console.log("req.query changed to: " + JSON.stringify(req.query, null, 2));
    const authorizationCode = req.query.code;
    
    if (authorizationCode) {
      console.log("A Cookie: connect.sid=" + req.cookies['connect.sid']);
      console.log("Authorization Code:", authorizationCode);
      // You could save this to the session or use it to fetch the access token
    } else {
      console.log("No authorization code found.");
    }
    next();
  },
  passport.authenticate('github',  { failureRedirect: '../error/401' }),
  (req, res) => {
    // console.log("res.query: " + CircularJSON.stringify(res, null, 2));
    res.status(200).redirect('/dashboard');
  }
);
// END ******************************** GITHUB OAUTH *********************************** END//

// @desc    Logout user
// @route   /auth/logout
routes.get('/logout', (req, res, next) => {
  req.logout((error) => { //clears the session on your app’s side
    if (error) { return next(error); }
    req.session.destroy((err) => { //completely remove the session data
      if (err) { return next(err); }
      res.status(200).redirect('/');
    });
  });
});

module.exports = routes

const passport = require('passport');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports = {
  ensureAuth: function (req, res, next) {
    // console.log(`HEADER-auth: ${JSON.stringify(req.headers, null, 2)}`)
    // console.log('User from OAuth:', req.user);  // Verify that the user object is attached to the request
    if (req.isAuthenticated()) {     
      return next();
    } else {
      res.redirect('/')
    }
  },

  // ensureAuth: async function (req, res, next) {
  //   const authHeader = req.headers['authorization'];
  //   if (!authHeader) {
  //     return res.status(403).json({ message: "No authorization header" });
  //   }

  //   const token = authHeader.split(' ')[1]; // Extract the Bearer token from the Authorization header
  //   if (!token) {
  //     return res.status(403).json({ message: "No token provided" });
  //   }

  //   try {
  //     const ticket = await client.verifyIdToken({
  //       idToken: token,
  //       audience: process.env.GOOGLE_CLIENT_ID,  // Ensure this matches your Google Client ID
  //     });
  //     const payload = ticket.getPayload();
  //     console.log('Verified token payload:', payload);
  //     req.user = payload; // Store decoded user data in the request object
  //     next(); // Proceed to the next middleware or route handler
  //   } catch (error) {
  //     console.error('Token verification failed:', error);
  //     return res.status(401).json({ message: 'Invalid token' });
  //   }
  // },

  // ensureAuth: function (req, res, next) {
  //   const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    
  //   if (!token) {
  //     return res.redirect('/'); // No token found
  //   }
  
  //   // Verify the token
  //   jwt.verify(token, process.env.GOOGLE_CLIENT_SECRET, (err, decoded) => {
  //     if (err) {
  //       console.log('Token is invalid:', err);
  //       return res.redirect('/'); // Invalid token
  //     }
  //     console.log('Decoded token:', decoded);
  //     req.user = decoded; // Attach the decoded user to the request object
  //     return next();
  //   });
  // },

  // ensureAuth: function (req, res, next) {
  //   console.log('HEADER-AUTH (div by " "): ' + req.headers['authorization'])
  //   const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header
  //   // console.log('Token:', token); // Log token
  //   if (!token) {
  //     console.log("!!!!!!!! NO TOKEN REDIRECT")
  //     return res.redirect('/');
  //   }

  //   passport.authenticate('google-token', { session: false }, (err, user) => {
  //     // if (err || !user) {
  //     if (err) {
  //       console.log('AUTH FAILED \n error: ' + err + 'user: ' + user.id);
  //       return res.redirect('/');
  //     }    

  //     req.user = user; // Attach the authenticated user to the request
  //     console.log('Authenticated user:', user);
  //     return next(); // Proceed to the next middleware or route handler
  //   })(req, res, next); // Call authenticate with the request, response, and next function
  // },

  ensureGuest: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/dashboard');
    }
  },
};
const routes = require('express').Router();
const profile = require('./profile');
const creation = require('./creation');
const swagger = require('./swagger');
const oauth = require('./oauth');
const oauthCallback = require('./oauth-callback');
const auth = require('./auth'); // google auth 
const dashboard = require('./dashboard'); // google auth 
const creationGoals = require('./creationGoals'); // google auth 
const { ensureGuest } = require('../middleware/auth'); // google auth 

// google auth BASE/HOME/PAGE
//  @desc   Login/Landing page
//  @route  GET /
routes.get('/', ensureGuest, (req, res) => {
  try {  
    const accessDenied = req.query.accessDenied === 'true';  // Check if 'accessDenied' is true in the query
    res.status(accessDenied ? 401 : 200).render('login', {
        layout: 'login',
        accessDenied, // Pass accessDenied flag to the view
    })
  } catch (error) {
    console.error(error);
    res.status(500).render('error/500')
  }
});


routes.use('/', oauth)
routes.use('/', oauthCallback)
routes.use('/', swagger);
routes.use('/profiles', profile);
routes.use('/creations', creation);
routes.use('/auth', auth);  // google auth - put here instead of in root/index.js
routes.use('/dashboard', dashboard);  // google auth - put here instead of in root/index.js
routes.use('/creationGoals', creationGoals);  // google auth - put here instead of in root/index.js

module.exports = routes;

// google auth
const express = require('express');
const routes = express.Router();
const { ensureAuth } = require('../middleware/auth');
const Creation = require('../models/CreationGoal');

// google auth or github
//  @desc   Dashboard
//  @route  GET /dashboard
routes.get('/', ensureAuth, async (req, res) => { 
  try {  
    const creationGoals = await Creation.find({ user: req.user.id }).lean();    
    // Check if the `created` query parameter is true
    const created = req.query.created === 'true';
    // Check if the `created` query parameter is true
    const updated = req.query.updated === 'true';
    // Check if the `created` query parameter is true
    const deleted = req.query.deleted === 'true';
    res.status(created ? 201 : 200).render('dashboard', {      
      name: `${req.user.firstName} ${req.user.lastName}`,      
      creationGoals,       
      created, // Pass this to the Handlebars template 
      updated, // Pass this to the Handlebars template 
      deleted, // Pass this to the Handlebars template 
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error/500')
  }
})

module.exports = routes;
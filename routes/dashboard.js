// google auth
const express = require('express');
const routes = express.Router();
const { ensureAuth } = require('../middleware/auth');
const Creation = require('../models/CreationGoal');

// google auth 
//  @desc   Dashboard
//  @route  GET /dashboard
routes.get('/', ensureAuth, async (req, res) => { 
  try {
    const creationGoals = await Creation.find({ user: req.user.id }).lean()
    res.render('dashboard', {
      name: `${req.user.firstName} ${req.user.lastName}`,
      creationGoals,
    });
  } catch (error) {
    console.error(error);
    res.render('error/500')
  }
})

module.exports = routes;
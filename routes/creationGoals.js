// google auth
const express = require('express');
const routes = express.Router();
const { ensureAuth } = require('../middleware/auth');
const creationGoal = require('../controllers/creationGoal.js');
const validation = require('../middleware/creationGoal-validator.js');

/*** OTHER types of GET ROUTES ***************************************************************************/
//@desc Search creationGoals by title
//@route GET /creationGoals/search/:query
// Defined for swagger in comments to correct autogen adding two inputs of path & query    
    // #swagger.start 
    /* #swagger.security = [{ "bearerAuth": [] }] */
    /* #swagger.summary = "GETS all the Public creationGoals that meet search criteria within the goal definition ---------- (!!!OAUTH PROTECTED ROUTE!!!)" */   
    /* #swagger.description = 'All Public creationGoals within goal definition search criteria are displayed on the creationGoals index page.' */
    /* #swagger.path = '/creationGoals/search/{query}'
    #swagger.method = 'get'
    #swagger.description = 'Search term for goal category of the Public creationGoals.'
    #swagger.produces = ['application/json'] */        
    /* #swagger.parameters['query'] = {
        in: 'query',
        description: 'Search term for creationGoals',        
        type: 'string'
    } */   
    // #swagger.responses[200] = { description: 'SUCCESS, GET returned all Public creationGoals that met the search criteria' }
    // #swagger.responses[401] = { description: 'You are NOT AUTHORIZED to GET the Public creationGoals'}
    // #swagger.responses[404] = { description: 'The attempted GET of all Public creationGoals within the search were Not Found'}
    // #swagger.end
    routes.get('/search/:query', ensureAuth, creationGoal.getPublicSearchResults);

    // @desc    User creationGoals
    // @route   GET /creationGoals/user/:userId
    routes.get('/user/:userId', ensureAuth, creationGoal.getUserCreationGoals);
    
    // @desc    Show edit page
    // @route   GET /creationGoals/edit/:id
    routes.get('/edit/:id', ensureAuth, creationGoal.getUsersCreationGoalById);
    
    // @desc    Show add page
    // @route   GET /creationGoals/add
    routes.get('/add', ensureAuth, creationGoal.getAddForm);

/*** MAIN 2 types of GET ROUTES ***************************************************************************/
// @desc    Show all creationGoals
// @route   GET /creationGoals   
routes.get('/', ensureAuth, creationGoal.getAllPublicCreationGaols);

// @desc    Show single creationGoal
// @route   GET /creationGoals/:id
// Defined for swagger in comments to correct autogen adding the regex in
    // #swagger.start 
    /* #swagger.security = [{ "bearerAuth": [] }] */
    /* #swagger.summary = "GETS a creationGoals by its _id ---------- (!!!OAUTH PROTECTED ROUTE!!!)" */   
    /* #swagger.path = '/creationGoals/{id}'
        #swagger.method = 'get'
        #swagger.description = 'The selected creationGoal is displayed on the creationGoals show page.'
        #swagger.produces = ['application/json'] */     
     /* #swagger.parameters['id'] = {
         in: 'path',
         description: 'Unique identifier for the user',
         required: true,
         type: 'string'
     } */
    // #swagger.responses[200] = { description: 'SUCCESS, GET returned the selected creationGoal' }
    // #swagger.responses[401] = { description: 'You are NOT AUTHORIZED to GET this creationGoal'}
    // #swagger.responses[404] = { description: 'The attempted GET of specified creationGoal was Not Found'}
    // Swagger doc comments   
    // #swagger.end
routes.get('/:id([a-fA-F0-9]{24})', ensureAuth, creationGoal.getCreationGoalById);

/*** MAIN 3 alter data ROUTES ***************************************************************************/
// @desc    Process add form
// @route   POST /creationGoals
routes.post('/', ensureAuth, creationGoal.addCreationGoal);

// @desc    Update creationGoal
// @route   PUT /creationGoals/:id
routes.put('/:id', ensureAuth, creationGoal.updateCreationGoal);

// @desc    Delete creationGoal
// @route   DELETE /creationGoals/:id
routes.delete('/:id', ensureAuth, creationGoal.deleteCreationGoal);

module.exports = routes
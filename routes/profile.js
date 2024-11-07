const routes = require('express').Router();
const profiles = require('../controllers/profile.js');
const validation = require('../middleware/profile-validator');

routes.get('/', profiles.findAll);
routes.get('/:username', validation.approveUsername, profiles.findOne);
routes.post('/', validation.acceptProfileInput, profiles.create);
routes.put('/:username', validation.approveUsername, validation.acceptProfileInput, profiles.update);
routes.delete('/:username', validation.approveUsername, profiles.delete);

module.exports = routes;

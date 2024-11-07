const routes = require('express').Router();
const creations = require('../controllers/creation.js');
const validation = require('../middleware/creation-validator');

routes.get('/', creations.findAll);
routes.get('/:creationNumber', validation.approveCreationNumber, creations.findOne);
routes.post('/', validation.acceptCreationInput, creations.create);
routes.put('/:creationNumber', validation.approveCreationNumber, validation.acceptCreationInput, creations.update);
routes.delete('/:creationNumber', validation.approveCreationNumber, creations.delete);

module.exports = routes;
const validator = require('../helpers/validation-methods');

// Sources: https://github.com/mikeerickson/validatorjs & https://blog.logrocket.com/handle-data-validation-node-js-validatorjs/
const acceptCreationInput = (req, res, next) => {
  const creationValidationRules = {
    creationNumber: 'numeric',
    motivator: 'required|string',    
    desire: 'required|string',
    belief: 'required|string',
    knowledge: 'required|string',
    goal: 'required|string',
    plan: 'required|string',
    action: 'required|string',
    victory: 'required|string',
    creationDate: 'date'
  };
  validator(req.body, creationValidationRules, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

const approveCreationNumber = (req, res, next) => {
  const rules = {
    creationNumber: 'required|numeric'
  };
  // Apply validation to req.params which holds URL parameters
  validator({ creationNumber: req.params.creationNumber }, rules, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

module.exports = {
  acceptCreationInput,
  approveCreationNumber
};
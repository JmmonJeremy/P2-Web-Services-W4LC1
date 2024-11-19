const validator = require('../helpers/validation-methods');

// Sources: https://github.com/mikeerickson/validatorjs & https://blog.logrocket.com/handle-data-validation-node-js-validatorjs/
const acceptCreationInput = (req, res, next) => {
  const creatoinValidationRules = {
    creationNumber: 'integer',
    creationDate: 'date',    
    goal: 'required|string',
    motivator: 'required|string',
    desire: 'required|string',
    belief: 'required|string',
    knowledge: 'required|string',
    plan: 'required|string',
    action: 'string',
    status: 'string'
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

const approveCreationId = (req, res, next) => {
  const rules = {
    _id: 'required'
  };
  // Apply validation to req.params which holds URL parameters
  validator({ _id: req.params.id }, rules, {}, (err, status) => {
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

const approveUserId = (req, res, next) => {
  const rules = {
    user_id: 'required|alpha_num'
  };
  // Apply validation to req.params which holds URL parameters
  validator({ user_id: req.params.userId }, rules, {}, (err, status) => {
    
    console.log(`###user_id: ${req.params.userId}`)   
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
  approveCreationId,
  approveUserId
};
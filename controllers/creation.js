const db = require('../models');
const Creation = db.Creation;

exports.create = (req, res) => { 
  // #swagger.responses[201] = { description: 'Successfully Created Creation Object' }
  console.log('Request Body:', req.body); // Log the entire request body
  // Validate request
  if (!req.body.goal) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }

  // Create a Creation
  const creation = new Creation({
    creationNumber: req.body.creationNumber,
    motivator: req.body.motivator,
    desire: req.body.desire,
    belief: req.body.belief,
    knowledge: req.body.knowledge,
    goal: req.body.goal,
    plan: req.body.plan,   
    action: req.body.action,
    victory: req.body.victory,
    creationDate: req.body.creationDate   
  });
  // Save Creation in the database
  creation
    .save(creation)
    .then((data) => {
      if(data) {
        res.status(201).json(data);
      } else {
        res.status(400).json(data.error || 'The server did not process the request. Some error occurred while creating the Creation Object.');
      }      
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Creation Object.',
      });
    });
};

exports.findAll = (req, res) => {
  // #swagger.responses[200] = { description: 'Successfully Retrieved of all Creations' }
    Creation.find({})
      .sort({ creationNumber: 1 }) // Sort by creationNumber in ascending order
      .then((data) => { 
        if (!data)
          res
            .status(404)
            .send({ message: 'No Creations found! There are either no Creations yet, or their was an error retrieving them.'});         
        else res.send(data); // Send the newly ordered data  
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while retrieving Creations.',
        });
      }); 
    }

// Find a single Creation with an id
exports.findOne = (req, res) => {
  // #swagger.responses[200] = { description: 'Successfully Retrieved Creation' }
  const creationNumber = req.params.creationNumber; 
  Creation.find({ creationNumber: creationNumber })
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({ message: 'Creation with creationNumber ' + creationNumber + ' not found!'});
      else res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving Creation with creationNumber: "' + creationNumber + '"',
      });
    });
};

// Update a Creation by the id in the request (For some reason auto-gen misses the added responses in update function only)
exports.update = (req, res) => {
  // #swagger.responses[204] = { description: 'Successfully Updated Creation' }
  // #swagger.responses[400] = { description: 'Bad Request' }
  // #swagger.responses[404] = { description: 'Not Found' }
  // #swagger.responses[500] = { description: 'Internal Server Error' }
  if (!req.body) {
    return res.status(400).send({
      message: 'Data to update can not be empty!',
    });
  }
  /* #swagger.parameters['creationNumber'] = {
         in: 'path',
         description: 'Unique identifier for the Creation',
         required: true,
         type: 'string'
     } */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Fields to update',
        required: true,
         '@schema': {
          "type": "object",
          "properties": {
            "goal": {
              "type": "string",
              "example": "Updated goal"
            },
            "motivator": {
              "type": "string",
              "example": "Updated motivator"
            },
            "desire": {
              "type": "string",
              "example": "Updated desire"
            },
            "belief": {
              "type": "string",
              "example": "Updated belief"
            },
            "knowledge": {
              "type": "string",
              "example": "Updated knowledge"
            },
            "plan": {
              "type": "string",
              "example": "Updated plan"
            },
            "action": {
              "type": "string",
              "example": "Updated action"
            },
            "victory": {
              "type": "string",
              "example": "Updated victory"
            }
          },
          "required": "goal"
        }
      }
    }
  */
  const creationNumber = req.params.creationNumber;  

  Creation.findOneAndUpdate({ creationNumber: creationNumber }, req.body, { new: true, useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Creation with creationNumber=${creationNumber}. This creationNumber was not found!`,
        });
      } else res.status(204).send({ message: 'Creation was updated successfully.' });
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Creation with creationNumber=' + creationNumber,
      });
    });
};

// Delete a Creation with the specified id in the request
exports.delete = (req, res) => {
  // #swagger.responses[200] = { description: 'Successful Deletion of Creation' }
  const creationNumber = req.params.creationNumber; 

  Creation.findOneAndDelete({ creationNumber: creationNumber }) 
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Creation with creationNumber=${creationNumber}. This creationNumber was not found!!`,
        });
      } else {
        res.send({
          message: 'Creation was deleted successfully!',
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Deletion error. Could not delete Creation with creationNumber=' + creationNumber,
      });
    });
};
const db = require('../models');
const users = db.User;

exports.findAll = (req, res) => {
  // #swagger.responses[200] = { description: 'Successfully Retrieved of all users' }
  console.log(users)
    users.find({})
      .sort({ lastName: 1 }) // Sort by lastName in ascending order
      .then((data) => { 
        if (!data)
          res
            .status(404)
            .send({ message: 'No users found! There are either no users yet, or their was an error retrieving them.'});         
        else res.send(data); // Send the newly ordered data  
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while retrieving users.',
        });
      }); 
    }

// Find a single user with an id
exports.findOne = (req, res) => {
  // #swagger.responses[200] = { description: 'Successfully Retrieved user' }
  const id = req.params.id; 
  users.find({ _id: id })
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({ message: 'user with id ' + id + ' not found!'});
      else res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving user with id: "' + id + '"',
      });
    });
};

exports.create = (req, res) => { 
  // #swagger.responses[201] = { description: 'Successfully Created users Object' }
  console.log('Request Body:', req.body); // Log the entire request body
  // Validate request
  if (!req.body.email) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }

  // Create a user
  const user = new users({
    // id_: req.body._id,
    email: req.body.email,
    googleId: req.body.googleId,
    githubId: req.body.githubId,
    displayName: req.body.displayName,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    image: req.body.image,
    bio: req.body.bio,   
    location: req.body.location,
    company: req.body.company,
    website: req.body.website,
    // createdAt: req.body.createdAt  
  });
  // Save user in the database
  user
    .save(user)
    .then((data) => {
      if(data) {
        res.status(201).json(data);
      } else {
        res.status(400).json(data.error || 'The server did not process the request. Some error occurred while creating the user Object.');
      }      
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the user Object.',
      });
    });
};

// Update a user by the id in the request (For some reason auto-gen misses the added responses in update function only)
exports.update = (req, res) => {
  // #swagger.responses[204] = { description: 'Successfully Updated user' }
  // #swagger.responses[400] = { description: 'Bad Request' }
  // #swagger.responses[404] = { description: 'Not Found' }
  // #swagger.responses[500] = { description: 'Internal Server Error' }
  if (!req.body) {
    return res.status(400).send({
      message: 'Data to update can not be empty!',
    });
  }
  /* #swagger.parameters['id'] = {
         in: 'path',
         description: 'Unique identifier for the user',
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
            "googleId": {
              "type": "string",
              "example": "Updated googleId"
            },
            "githubId": {
              "type": "string",
              "example": "Updated githubId"
            },
            "email": {
              "type": "string",
              "example": "Updated email"
            },
            "displayname": {
              "type": "string",
              "example": "Updated displayname"
            },
            "firstName": {
              "type": "string",
              "example": "Updated firstName"
            },
            "lastName": {
              "type": "string",
              "example": "Updated lastName"
            },
            "image": {
              "type": "string",
              "example": "Updated image"
            },
            "bio": {
              "type": "string",
              "example": "Updated bio"
            },
            "location": {
              "type": "string",
              "example": "Updated location"
            },
            "company": {
              "type": "string",
              "example": "Updated company"
            },
            "website": {
              "type": "string",
              "example": "Updated website"
            }
          },
          "required": "email"
        }
      }
    }
  */
  const id = req.params.id;  

  users.findOneAndUpdate({ _id: id }, req.body, { new: true, useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update user with id=${id}. This id was not found!`,
        });
      } else res.status(204).send({ message: 'User was updated successfully.' });
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating user with id=' + id,
      });
    });
};

// Delete a user with the specified id in the request
exports.delete = (req, res) => {
  // #swagger.responses[200] = { description: 'Successful Deletion of user' }
  const id = req.params.id; 

  users.findOneAndDelete({ _id: id }) 
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete user with id=${id}. This id was not found!!`,
        });
      } else {
        res.send({
          message: 'User was deleted successfully!',
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Deletion error. Could not delete user with id=' + id,
      });
    });
};
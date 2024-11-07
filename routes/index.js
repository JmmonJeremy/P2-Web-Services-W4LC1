const routes = require('express').Router();
const profile = require('./profile');
const creation = require('./creation');
const swagger = require('./swagger');
const oauth = require('./oauth');
const oauthCallback = require('./oauth-callback');
const static = require("./static");
const auth = require('./auth');

// google auth 
//  @desc   Login/Landing page
//  @route  GET /
routes.get('/', (req, res) => {
  res.render('login', {
      layout: 'login',
  })
})

// google auth 
//  @desc   Dashboard
//  @route  GET /dashboard
routes.get('/dashboard', (req, res) => {
  res.render('dashboard')
})

// See https://swagger-autogen.github.io/docs/swagger-2/schemas-and-definitions under @schema section for guidance
// routes.get('/', (req, res) => {
//   /* #swagger.description = "Welcome to the Goal Creation API" */
//   /* #swagger.responses[200] = { 
//         description: "Successfully Loaded Welcome", 
//         '@schema': { 
//              "type": "object",
//             "properties": {
//               "welcome": {
//                 "type": "string",
//                 "example": "Welcome to the Place that Turns Your Goals into Victorious Creations"
//                 } 
//               } 
//             } 
//           } 
//         }    
//   */ 
//  try {
//   // res.redirect(
//   //   `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`,
//   // );
//   console.log("GET / route handler is being hit");
//   const docData = 'Welcome to the Place that Turns Your Goals into Victorious Creations!';
//   res.send(docData);
//  } catch (error) {
//   res.status(500).send({
//     message:
//       error.message || 'An error occurred while processing the request.',
//   });
//  }
// });

routes.use('/', static)
routes.use('/', oauth)
routes.use('/', oauthCallback)
routes.use('/', swagger);
routes.use('/profiles', profile);
routes.use('/creations', creation);
routes.use('/auth', auth);  // google auth - put here instead of in root/index.js

module.exports = routes;

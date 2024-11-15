const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
// const dotenv = require('dotenv'); // This is necessary to use the config.env file instead of .env file
const morgan = require('morgan'); // google auth 
// const exphbs = require('express-handlebars'); // google auth (for versions below v6)
// const path = require('path'); // google auth 
const passport = require('passport'); // google auth 
const session = require('express-session'); // google auth
const { engine } = require('express-handlebars'); // google auth (for versions v6 on) 
const MongoStore = require('connect-mongo'); // google auth 
const methodOverride = require('method-override'); // google auth 
const cookieParser = require('cookie-parser'); // to get REQUIRED cookie for routes.rest requiests
const connectDB = require('./config/db'); // google auth database add-on
const swaggerDocument = require('./swagger.json');

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser());

// Method override from: https://www.npmjs.com/package/method-override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

// google auth 
// Load config ***This is necessary to use the config.env file instead of .env file
// dotenv.config({path: './config/config.env'});
// Passport config - passport at end is passed to config/passport.js function
require('./config/passport')(passport)
connectDB(); // google auth database add-on database connection

// google auth   (Order #1)(OLD ORDER #8)
// Changing order of Sessions & Passport middleware up to top here fixed not being found
// Sessions middleware code from: https://www.npmjs.com/package/express-session 
// Sessions middleware
// console.log('Initializing session middleware...');
app.use(session({
  secret: 'victory-planner',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
}));

// google auth   (Order #2)(OLD ORDER #9)
// Passport middleware
// console.log('Initializing Passport middleware...');
app.use(passport.initialize());
app.use(passport.session());

// Middleware to save accessToken to session
app.use((req, res, next) => {
  if (req.user) {
    req.accessToken = req.user.accessToken;
    req.user = req.user.user; // redefine req.user to only contain the user object
  }
  next();
});

// google auth
// Logging       (Order #3)(OLD ORDER #6)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// google auth
// Set global variable
app.use(function(req, res, next) {  
  res.locals.user = req.user || null; //used for editIcon function
  res.locals.req = req; // Make `req` accessible in all Handlebars templates
  next();
})

// google auth
// Handlebars Helpers
const { formatDate, stripTags, truncate, editIcon, select, getMonth, getDay, getYear, goBack, log } = require('./helpers/hbs');

// google auth
// Handlebars    (Order #4)(OLD ORDER #7)
// app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'})); // google auth (for versions below v6)
app.engine('.hbs', engine({ helpers: { formatDate, stripTags, truncate, editIcon, select, getMonth, getDay, getYear, goBack, log }, defaultLayout: 'main', extname: '.hbs' }));  // google auth (for versions v6 on)
app.set('view engine', '.hbs');

// CORS setup    (Order #5)(OLD ORDER #2)
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Swagger setup (Order #6)(OLD ORDER #1)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Define your routes         (Order #7)(OLD ORDER #3)
app.use('/', require('./routes'));  // google auth - uses ./routes/index
// .use('/auth', require('./routes/auth'));  // google auth - did this in the routes/index.js file

// Global error handler
app.use((err, req, res, next) => {
  console.error("Passport authentication error:", err);

  // Redirect to the custom 401 error page
  res.render('error/401');
});

// Catch uncaught exceptions  (Order #8)(OLD ORDER #4)
process.on('uncaughtException', (err, origin) => {
  console.log(`Caught exception: ${err}\nException origin: ${origin}`);
});

// Orignal connection to mongoose database (Not Included, but I put at Order #9)(OLD ORDER #5)
const db = require('./models');
db.mongoose
  .connect(db.url, {
    // useNewUrlParser: true, (deprecated option - no longer needed)
    // useUnifiedTopology: true, (deprecated option - no longer needed)
  })
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch((err) => {
    console.log('Cannot connect to the database!', err);
    process.exit();
  });

// Start the server (Order #10)(OLD ORDER #10)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}.`);
});

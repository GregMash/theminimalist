require('dotenv').config()
const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
// const session = require('express-session');
const cors = require('cors');
const PORT = process.env.PORT || 3001;
const mongoose = require("mongoose");
const errorHandler = require('errorhandler');
var hbs = require( 'express-handlebars');


//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

const app = express();


app.set('view engine', 'hbs');

app.engine( 'hbs', hbs( {
  extname: 'hbs',
  defaultView: 'index',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/'
}));

// Define middleware here
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// Serve up static assets (usually on heroku)
console.log(`Running in ${process.env.NODE_ENV} environment`)
if (isProduction) {
  // app.use(express.static("client/build"));
  // app.use(express.static(path.join(__dirname, 'client/build')));
}
if(!isProduction) {
  app.use(errorHandler());
}

// Connecting to Mongo DB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/theminimalist", { useNewUrlParser: true });
mongoose.set('debug', true);


 
//Error handlers & middlewares
if(!isProduction) {
  app.use((err, req, res,next) => {
    // console.log(req)
    console.log(res)
    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

// Passport model import
require('./models/Users');
require('./config/passport');
const routes = require("./routes");
app.use(routes);

// Send every other request to the React app
// Define any API routes before this runs
// app.get("*", (req, res) => {
//   //test password, and if not then redirect to login
//   res.sendFile(path.join(__dirname, "./client/build/index.html"));
// });

// Start the API server
app.listen(PORT, function () {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
}); 
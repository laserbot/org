// base setup

// call packages
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var mongoose   = require('mongoose');
var config     = require('./config');
var path       = require('path');

//APP CONFIG======================================
//user body parser to grab info from POST requests
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

//configure app to handle CORS requests
app.use(function(req,res,next){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST');
  res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type, Authorization');
  next();
});

//log all requests to console
app.use(morgan('dev'));

//connect to our database
mongoose.connect(config.database);

//API ROUTES------
var apiRoutes = require('./app/routes/api')(app,express);
app.use('/api',apiRoutes);

//main catchall route
//send users to frontend
//has to be registered after API ROUTES
app.get('*', function(req,res){
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

//start the server
app.listen(config.port);
console.log('Server running on ' + config.port);
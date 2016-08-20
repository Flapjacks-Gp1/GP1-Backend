var config = require('./config/config');
var mongoose = require('./config/mongoose');
var db = mongoose();
var bodyParser = require('body-parser');

var express = require('express');
var app = express();

var port = process.env.PORT || 9000;
app.set('port', port);

//set all the middlewares
//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});


var api_routes = require('./config/routes');
app.use('/api', api_routes);

app.listen(app.get('port'), function() {
  console.log('My express server is running at localhost', app.get('port'));
});

module.exports = app;

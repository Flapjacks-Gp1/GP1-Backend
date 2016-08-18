var config = require('./config/config');
var mongoose = require('./config/mongoose');
var db = mongoose();
var bodyParser = require('body-parser');

var express = require('express');
var app = express();

var port = process.env.PORT || 9000;
app.set('port', port);

app.listen(app.get('port'), function() {
  console.log('My express server is running at localhost', app.get('port'));
});

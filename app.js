var config = require('./config/config');
var mongoose = require('./config/mongoose');
var db = mongoose();
var bodyParser = require('body-parser');
var expressJWT = require('express-jwt');
var express = require('express');
var app = express();
var jwt_secret = 'whateversuperduperwho';
var methodOverride = require('method-override');
app.use(methodOverride('_method'));

var port = process.env.PORT || 9000;
app.set('port', port);

//set all the middlewares
//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});


app.use(
  expressJWT({
    secret: jwt_secret
  })
  .unless({
    path: [
      '/api/signup',
      '/api/login',
      {
        url: '/api/events',
        methods: ['GET']
      },
      {
        url: new RegExp('/api/events.*/', 'i'),
        methods: ['GET']
      }
      // '/login',
      // { url: new RegExp('/users.*/', 'i'), methods: ['PUT', 'GET']  }
    ]
  })
);

var api_routes = require('./config/routes');
app.use('/api', api_routes);

app.listen(app.get('port'), function() {
  console.log('My express server is running at localhost', app.get('port'));
});

// module.exports = app;

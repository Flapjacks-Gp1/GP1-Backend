var express = require('express');
var router = express.Router(),
    jwt = require('jsonwebtoken'),
    jwt_secret = 'whateversuperduperwho';
   var expressJWT = require('express-jwt');
var User = require('../models/user');
var Event = require('../models/event');

//updated routes for events
router.post('/signup', function(req, res) {

  //set var for the posted request
  var user_object = req.body;
  //set new user object
  var new_user = new User(user_object);
  //save the new user object
  new_user.save(function(err, user) {
    if (err) return res.status(400).send(err);
    return res.status(200).send({
      message: 'user created'
    });
  });
});


router.post('/login', function(req, res) {
 var loggedin_user = req.body;

 User.findOne(
   loggedin_user,
   function(err, found_user) {
     // this is error find flow
     if (err) return res.status(400).send(err);

     if (found_user) {
       var payload = {
         id: found_user.id,
         email: found_user.email
       };
       var expiryObj = {
         expiresIn: '3h'
       };
       console.log( payload, expiryObj, jwt_secret);
       var jwt_token =
         jwt.sign(payload, jwt_secret, expiryObj);
        //edited to expiry object
      var userID = found_user.id;


       return res.status(200).send({token: jwt_token, id: userID});
     } else {
       // this is login failed flow
       return res.status(400).send({
         message: 'login failed'
       });
     }
   });
});

router.route('/events/:event_id')
  .get(function(req, res, next) {
    var event_id = req.params.event_id;
    Event.findOne({
      _id: event_id
    }, function(err, event) {
      if (err) return next(err);
      res.json(event);
    });
  })

  .put(function(req, res, next) {
    console.log(req.body);
    var event_id = req.params.event_id;

    Event.findByIdAndUpdate(event_id, req.body, {new: true},function(err, event) {
      if (err) res.status(400).send(err);
      res.json(event)
      });
    })
  .delete(function(req, res) {
    var event_id = req.params.event_id;
    Event.findOneAndRemove(event_id, req.body, function(err, event) {
      console.log("event_id" + event_id);
      if (err) return next(err);
      res.json(event);
      });
    });

  router.route('/events')
  .get(function(req, res) {
    Event.find({})
    .populate('users')
    .exec(function(err, events) {
      if (err) res.status(400).send(err);
      res.json(events);
    });
  })
  .post(function(req, res, next) {
    console.log(req.body);
    var new_event = new Event(req.body);
    console.log(req.body.user);
    new_event.save(function(err) {
      if (err) return next(err);
      var user_id = req.body.user;
      //save event id to user
      User.findByIdAndUpdate(user_id, req.body, function(err, update_user) {
        if (err) res.status(400).send(err);
        var new_event_id = new_event.event_id;
        update_user.events.push(new_event_id);
      });
      res.json(new_event);
    });
  });

module.exports = router;

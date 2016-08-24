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

    var payload = {
      id: new_user.id,
      email: new_user.email
    };
    var expiryObj = {
      expiresIn: '3h'
    };
    console.log( payload, expiryObj, jwt_secret);
    var jwt_token =
      jwt.sign(payload, jwt_secret, expiryObj);

    var userID = new_user.id;

    return res.status(200).send({token: jwt_token, id: userID, name: new_user.name});

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
        console.log(payload, expiryObj, jwt_secret);
        var jwt_token =
          jwt.sign(payload, jwt_secret, expiryObj);
        //edited to expiry object
        var userID = found_user.id;

        return res.status(200).send({
          token: jwt_token,
          id: userID,
          name: found_user.name
        });
        //  return res.status(200).send(jwt_token);
      } else {
        // this is login failed flow
        return res.status(400).send({
          message: 'login failed'
        });
      }
    });
});

//logout

router.post('/logout', function(req, res) {
  blacklist.revoke(req.user)
  res.sendStatus(200);
})
//get all users
router.route('/users')
  .get(function(req, res) {
    User.find({})
      // .populate('events')
      .exec(function(err, users) {
        if (err) res.status(400).send(err);
        res.json(users);
      });
  })

// //edit and delete users
router.route('/users/:user_id')
  .get(function(req, res, next) {
    var user_id = req.params.user_id;

    User.findOne({
      _id: user_id
    }, function(err, user) {
      if (err) return next(err);
      console.log(user.events.length);

      for (i=0; i < user.events.length; i++){
        console.log(user.events[i]);
        var event_id = user.events[i];
      }
      res.json(user);
    })  .populate('events');
  })
//
.post(function(req, res, next) {
  console.log(req.body);
  var user_id = req.params.user_id;

  console.log("editing user");
  User.findByIdAndUpdate(user_id, req.body, {
    new: true
  }, function(err, user) {
    if (err) res.status(400).send(err);
    res.json(user);
  });
})
//
.delete(function(req, res) {
  var user_id = req.params.user_id;
  console.log("In delete method");
  // User.find({})
  //   .populate('events').remove()
  //   .exec(function(err, users) {
  //     if (err) res.status(400).send(err);
  //     // res.json(users);
  //   });

  // User.findOneAndRemove(user_id, req.body, function(err, user) {
  User.findOne({_id: user_id}, function(err, user) {
    user.remove();
    if (err) return next(err);
    res.json(user);
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

.post(function(req, res, next) {
  console.log(req.body);
  var event_id = req.params.event_id;

  Event.findByIdAndUpdate(event_id, req.body, {
    new: true
  }, function(err, event) {
    if (err) res.status(400).send(err);
    res.json(event)
  });
})

.delete(function(req, res) {
  var event_id = req.params.event_id;
  Event.findOneAndRemove({_id: event_id}, function(err, event) {
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
      var user_id = {_id: req.body.user };
      var update_event = {
        events: new_event._id
      };
      console.log(user_id);
      console.log(update_event);
      //save event id to user
      User.findByIdAndUpdate(user_id, {
        $push: update_event
      }, {
        safe: true,
        upsert: true,
        new: true
      }, function(err, update_user) {
        // if (err) res.status(400).send(err);
        console.log(err);
        console.log(update_user);
        // update_user.events.push(new_event_id);
      });
      res.json(new_event);
    });
  });



module.exports = router;

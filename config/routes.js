var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Event = require('../models/event');


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
      // console.log(req.body);
      var event_id = req.params.event_id;

      Event.findByIdAndUpdate(event_id, req.body, function(err, event) {
        if (err) res.status(400).send(err);
        Event.findOne({
          _id: event_id
        }, function(err, event) {
          res.json(event);
        });
      });
    })
  .delete(function(req, res) {
    var event_id = req.params.event_id;
    Event.findOneAndRemove(event_id, req.body, function(err, event) {
      if (err) return next(err);
      res.json(event);
    });
  });

  router.route('/events')
  .get(function(req, res) {
    Event.find({}, function(err, events) {
      if (err) return next(err);
      res.json(events);
    });
  })
  .post(function(req, res, next) {
    console.log(req.body);
    var new_event = new Event(req.body);
    new_event.save(function(err) {
      if (err) return next(err);
      res.json(new_event);
    });
  });

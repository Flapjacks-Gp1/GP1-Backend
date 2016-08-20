var mongoose = require('mongoose');
// var User = mongoose.model("User");
var eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
},
  description: {
    type: String,
    required: true
  },
user:[{
type: mongoose.Schema.Types.ObjectId,
ref: 'User'
}],
timestamps: {}
});

var Event = mongoose.model('Event', eventSchema);
module.exports = Event;

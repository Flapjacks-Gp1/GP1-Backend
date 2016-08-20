var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
},
  email: {
    type: String,
    required: true
  },
events:[{
type: mongoose.Schema.Types.ObjectId,
ref: 'Event'
}],
timestamps: {}
});

var User = mongoose.model('User', userSchema);
module.exports = User;


var mongoose = require('mongoose');
var Event = require('./event');
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
    required: true,
    unique: true
  },
events:[{
type: mongoose.Schema.Types.ObjectId,
ref: 'Event'
}],
}, {
  timestamps: {}
});

userSchema.pre('remove', function(next){
  Event.remove({user:this._id}).exec();
  next();
})
var User = mongoose.model('User', userSchema);
module.exports = User;

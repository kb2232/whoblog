var mongoose = require('mongoose'),
  bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('users', UserSchema);
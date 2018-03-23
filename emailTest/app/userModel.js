var mongoose = require('mongoose'),
  bcrypt = require('bcryptjs');

var userSchema = mongoose.Schema(
  {
    email: String,
    pw: String
});

//validates password matches the database;
//password is entered and compared with this.pw
userSchema.methods.validPassword = function(password) 
{
  return bcrypt.compareSync(password, this.pw);
};

module.exports = mongoose.model('real_users', userSchema);
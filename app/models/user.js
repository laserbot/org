//get packages needed for user model
var mongoose   = require('mongoose')
var Schema     = mongoose.Schema;
var bcrypt     = require('bcrypt-nodejs');

//user schema
var UserSchema   = new Schema({
  name: String,
  username: { type: String, required: true, index: { unique: true }},
  password: { type: String, required: true, select: false }
});

//hash the password before the user is saved
UserSchema.pre('save',function(next){
  var user = this;
  //hash password only if new user or changed
  if (!user.isModified('password')) return next();
  
  //generate the salt
  bcrypt.hash(user.password, null, null, function(err, hash){
    if (err) return next(err);
      
    //change password to hash
    user.password = hash;
    next();
  });
});

//method to compare a given password with db hash
UserSchema.methods.comparePassword = function(password) {
  var user = this;
  return bcrypt.compareSync(password, user.password);
};

//return the model
module.exports = mongoose.model('User', UserSchema);
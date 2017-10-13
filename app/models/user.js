var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique : true,
    required: true
  },
  genre: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User'}],
  friend_requests_sent: [{ type: Schema.Types.ObjectId, ref: 'User'}],
  friend_requests_received: [{ type: Schema.Types.ObjectId, ref: 'User'}]
}, {
  timestamps: true
});

userSchema.pre('save', function(next) {
  var user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.hash(user.password, 5, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return done(err);
    }
    done(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);

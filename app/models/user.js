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
    unique: true,
    required: true
  },
  gender: {
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
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  friend_requests_sent: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  friend_requests_received: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
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

userSchema.methods.deleteUser = function(done) {
  this.constructor.update({
    friends: {
      $in: [this._id]
    }
  }, {
    $pull: {
      friends: this._id
    }
  }).then(response => {
    if (response.ok != 1) done(false);
    this.constructor.update({
      friend_requests_sent: {
        $in: [this._id]
      }
    }, {
      $pull: {
        friend_requests_sent: this._id
      }
    }).then(response => {
      if (response.ok != 1) done(false);
      this.constructor.update({
        friend_requests_received: {
          $in: [this._id]
        }
      }, {
        $pull: {
          friend_requests_received: this._id
        }
      }).then(response => {
        done(response.ok == 1);
      });
    });
  });
}


module.exports = mongoose.model('User', userSchema);

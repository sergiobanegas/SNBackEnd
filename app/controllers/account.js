var mongoose = require('mongoose');
var User = mongoose.model('User');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var Conversation = mongoose.model('Conversation');
var Message = mongoose.model('Message');
var HTTPErrorResponse = require('./wrappers/http/HTTPErrorResponse');
var HTTP400ErrorResponse = require('./wrappers/http/HTTP400ErrorResponse');
var HTTPSuccessResponse = require('./wrappers/http/HTTPSuccessResponse');

exports.update = function(req, res) {
  User.findById(req.user.id, (err, user) => {
    if (err) {
      return res.status(500).send(new HTTPErrorResponse(err.message, 500));
    }
    if (req.body.name) {
      user.name = req.body.name;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }
    if (req.body.gender) {
      if (req.body.gender != "male" && req.body.gender != "female") {
        return res.status(400).send(new HTTP400ErrorResponse());
      }
      user.gender = req.body.gender;
    }
    user.save(error => {
      return error ?
        res.status(500).send(new HTTPErrorResponse(err.message, 500)) :
        res.status(200).jsonp({
          _id: user._id,
          updatedAt: user.updatedAt,
          createdAt: user.createdAt,
          name: user.name,
          email: user.email,
          gender: user.gender,
          avatar: user.avatar,
          friend_requests_received: user.friend_requests_received,
          friend_requests_sent: user.friend_requests_sent,
          friends: user.friends,
        });
    });
  });
};

exports.updatePassword = function(req, res) {
  if (!req.body.new_password || !req.body.old_password) {
    return res.status(400).send(new HTTP400ErrorResponse());
  }
  User.findById(req.user.id, (err, user) => {
    if (err) {
      return res.status(500).send(new HTTPErrorResponse(err.message, 500));
    }
    user.comparePassword(req.body.old_password, (err, response) => {
      if (err) {
        return res.status(500).send(new HTTPErrorResponse(err.message, 500));
      }
      if (!response) {
        return res.status(404).send(new HTTPErrorResponse("The old password is not correct", 404));
      }
      user.password = req.body.new_password;
      user.save(error => {
        return error ?
          res.status(500).send(new HTTPErrorResponse(err.message, 500)) :
          res.status(200).send(new HTTPSuccessResponse("Password updated", 200));
      });
    });
  });
};

exports.updateAvatar = function(req, res) {
  if (!req.file) {
    return res.status(400).send(new HTTP400ErrorResponse());
  }
  User.findById(req.user.id, (err, user) => {
    if (err) {
      return res.status(500).send(new HTTPErrorResponse(err.message, 500));
    }
    user.avatar = (req.file.path.replace(/\\/g, "/")).replace("public", "");
    user.save(error => {
      return error ? res.status(500).send(new HTTPErrorResponse(err.message, 500)) :
        res.status(200).send(new HTTPSuccessResponse("Avatar updated", 200));
    });
  });
};

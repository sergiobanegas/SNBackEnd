var mongoose = require('mongoose');
var User = mongoose.model('User');
var HTTPResponseError = require('./wrappers/errors/HTTPResponseError.js');

exports.findUserFriends = function(req, res) {
  User.findById(req.user.id).select('friends').populate('friends', (err, friends) => {
    return err ? res.send(500, new HTTPResponseError(err.message, 500)) : res.status(200).jsonp(friends);
  });
};

exports.addFriend = function(req, res) {
  User.findById(req.user.id, (err, user) => {
    if (err) return res.send(500, new HTTPResponseError(err.message, 500));
    if (req.user.id === req.body.user_id) {
      return res.status(400).send(new HTTPResponseError("You can't add yourself as a friend", 400));
    }
    if (user.friends.indexOf(req.body.user_id) > -1) {
      return res.status(400).send(new HTTPResponseError(`You already have the user with the id '${req.body.user_id}' as a friend`, 400));
    }
    user.friends.push(req.body.user_id);
    user.save(err => {
      return err ? res.send(500, new HTTPResponseError(err.message, 500)) : res.status(200).jsonp(user);
    });
  });
};

exports.deleteFriend = function(req, res) {
  User.findById(req.user.id, (err, user) => {
    if (user.friends.indexOf(req.body.user_id) === -1) {
      return res.status(404).send(new HTTPResponseError(`You don't have the user with the id '${req.body.user_id}' as a friend`, 404));
    }
    user.friends.pull({
      _id: req.body.user_id
    });
    user.save(error => {
      return error ? res.send(500, new HTTPResponseError(error.message, 500)) : res.status(200).jsonp(user);
    });
  });
};

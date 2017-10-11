var mongoose = require('mongoose');
var User = mongoose.model('User');
var HTTPResponseError = require('./wrappers/http/HTTPErrorResponse');

exports.findUserFriends = function(req, res) {
  User.findById(req.user.id).select('friends').populate('friends', (err, friends) => {
    return err ? res.send(500, new HTTPErrorResponse(err.message, 500)) : res.status(200).jsonp(friends);
  });
};

exports.requestFriend = function(req, res) {
  if (!req.body.user_id) {
    return res.status(400).send(new HTTP400ResponseError());
  }
  if (req.user.id === req.body.user_id) {
    return res.status(400).send(new HTTPErrorResponse("You can't add yourself as a friend", 400));
  }
  User.findById(req.body.user_id, (err, user) => {
    if (err) return res.send(500, new HTTPErrorResponse(err.message, 500));
    if (user.friend_requests.indexOf(req.user.id) > -1) {
      return res.status(400).send(new HTTPErrorResponse(`You already requested to be friends with the user with the id '${req.body.user_id}'`, 400));
    }
    user.friend_requests.push(req.user.id);
    user.save(err => {
      return err ? res.send(500, new HTTPErrorResponse(err.message, 500)) : res.status(200).jsonp(user);
    });
  });
};

exports.acceptFriend = function(req, res) {
  if (!req.body.user_id) {
    return res.status(400).send(new HTTP400ResponseError());
  }
  User.findById(req.user.id, (err, user) => {
    if (err) return res.send(500, new HTTPErrorResponse(err.message, 500));
    if (user.friend_requests.indexOf(req.body.user_id) === -1) {
      return res.status(400).send(new HTTPErrorResponse(`You don't have friend request from the user with the id '${req.body.user_id}'`, 400));
    }
    user.friend_requests.pull(req.body.user_id);
    user.friends.push(req.body.user_id);
    user.save(error => {
      if (error) {
        return res.send(500, new HTTPErrorResponse(error.message, 500));
      }
      User.findById(req.body.user_id, (userRemittentError, userRemittent) => {
        if (userRemittentError) {
          return res.send(500, new HTTPErrorResponse(userRemittentError.message, 500));
        }
        userRemittent.friends.push(req.user.id);
        userRemittent.save(errorSaving => {
          return errorSaving ? res.send(500, new HTTPErrorResponse(errorSaving.message, 500)) : res.status(200).jsonp(user);
        });
      });
    });
  });
};

exports.deleteFriend = function(req, res) {
  if (!req.body.user_id) {
    return res.status(400).send(new HTTP400ResponseError());
  }
  User.findById(req.user.id, (err, user) => {
    if (user.friends.indexOf(req.body.user_id) === -1) {
      return res.status(404).send(new HTTPErrorResponse(`You don't have the user with the id '${req.body.user_id}' as a friend`, 404));
    }
    user.friends.pull({
      _id: req.body.user_id
    });
    user.save(error => {
      return error ? res.send(500, new HTTPErrorResponse(error.message, 500)) : res.status(200).jsonp(user);
    });
  });
};

exports.deleteFriendRequest = function(req, res) {
  if (!req.body.user_id) {
    return res.status(400).send(new HTTP400ResponseError());
  }
  User.findById(req.body.user_id, (err, user) => {
    if (user.friend_requests.indexOf(req.user.id) === -1) {
      return res.status(404).send(new HTTPErrorResponse(`You need to be in the friend request list of the user with the id '${req.body.user_id}'`, 404));
    }
    user.friend_requests.pull({
      _id: req.user.id
    });
    user.save(error => {
      return error ? res.send(500, new HTTPErrorResponse(error.message, 500)) : res.status(200).jsonp(user);
    });
  });
};

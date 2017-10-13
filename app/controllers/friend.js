var mongoose = require('mongoose');
var User = mongoose.model('User');
var HTTPErrorResponse = require('./wrappers/http/HTTPErrorResponse');
var HTTPSuccessResponse = require('./wrappers/http/HTTPSuccessResponse');
var HTTP400ErrorResponse = require('./wrappers/http/HTTP400ErrorResponse');

exports.findUserFriends = function(req, res) {
  User.findById(req.user.id, (err, user) => {
    return err ? res.status(500).send(500, new HTTPErrorResponse(err.message, 500)) : res.status(200).jsonp(user.friends);
  }).select('friends');
};

exports.findUserFriendRequestsReceived = function(req, res) {
  User.findById(req.user.id, (err, user) => {
    return err ? res.status(500).send(500, new HTTPErrorResponse(err.message, 500)) : res.status(200).jsonp(user.friend_requests_received);
  }).select('friend_requests_received');
};

exports.findUserFriendRequestsSent = function(req, res) {
  User.findById(req.user.id, (err, user) => {
    return err ? res.status(500).send(500, new HTTPErrorResponse(err.message, 500)) : res.status(200).jsonp(user.friend_requests_sent);
  }).select('friend_requests_sent');
};

exports.requestFriend = function(req, res) {
  if (!req.body.user_id) {
    return res.status(400).send(new HTTP400ErrorResponse());
  }
  if (req.user.id === req.body.user_id) {
    return res.status(400).send(new HTTPErrorResponse("You can't add yourself as a friend", 400));
  }
  User.findById(req.body.user_id, function(err, user) {
    if (err) return res.status(500).send(new HTTPErrorResponse(err.message, 500));
    if (user.friend_requests_received.indexOf(req.user.id) > -1) {
      return res.status(400).send(new HTTPErrorResponse(`You already requested to be friends with the user with the id '${req.body.user_id}'`, 400));
    }
    user.friend_requests_received.push({
      _id: req.user.id
    });
    user.save(function(err) {
      if (err) return res.status(500).send(new HTTPErrorResponse(err.message, 500));
      User.findById(req.user.id, function(error, userRequesting) {
        if (error) return res.status(500).send(new HTTPErrorResponse(error.message, 500));
        userRequesting.friend_requests_sent.push({
          _id: req.body.user_id
        });
        userRequesting.save(function(saveErr) {
          if (saveErr) return res.status(500).send(new HTTPErrorResponse(saveErr.message, 500));
          return res.status(201).send(new HTTPSuccessResponse("Friend request created", 201));
        });
      });
    });
  });
};

exports.acceptFriend = function(req, res) {
  if (!req.body.user_id) {
    return res.status(400).send(new HTTP400ErrorResponse());
  }
  User.update({
    _id: req.user.id
  }, {
    $pull: {
      friend_requests_received: req.body.user_id
    },
    $push: {
      friends: req.body.user_id
    }
  }).then(function(response) {
    if (response.ok != 1) return res.status(500).send(new HTTPErrorResponse(error.message, 500));
    User.update({
      _id: req.body.user_id
    }, {
      $pull: {
        friend_requests_sent: req.user.id
      },
      $push: {
        friends: req.user.id
      }
    }).then(function(response) {
      if (response.ok != 1) return res.status(500).send(new HTTPErrorResponse(error.message, 500));
      return res.status(201).send(new HTTPSuccessResponse("Friend added", 201));
    });
  });
};

exports.deleteFriend = function(req, res) {
  if (!req.body.user_id) {
    return res.status(400).send(new HTTP400ErrorResponse());
  }
  User.update({
    _id: req.user.id
  }, {
    $pull: {
      friends: req.body.user_id
    },
  }).then(function(response) {
    if (response.ok != 1) return res.status(500).send(new HTTPErrorResponse(error.message, 500));
    User.update({
      _id: req.body.user_id
    }, {
      $pull: {
        friends: req.user.id
      }
    }).then(function(response) {
      if (response.ok != 1) return res.status(500).send(new HTTPErrorResponse(error.message, 500));
      return res.status(200).send(new HTTPSuccessResponse("Friend removed", 200));
    });
  });
};

exports.deleteFriendRequestReceived = function(req, res) {
  return deleteFriendRequest(res, req.body.user_id, req.user.id);
};

exports.deleteFriendRequestSent = function(req, res) {
  return deleteFriendRequest(res, req.user.id, req.body.user_id);
};

deleteFriendRequest = function(res, user1, user2) {
  if (!user1 || !user2) {
    return res.status(400).send(new HTTP400ErrorResponse());
  }
  User.update({
      _id: user2
    }, {
      $pull: {
        friend_requests_received: user1
      }
    })
    .then(function(response) {
      if (response.ok != 1) return res.status(500).send(new HTTPErrorResponse(error.message, 500));
      User.update({
          _id: user1
        }, {
          $pull: {
            friend_requests_sent: user2
          }
        })
        .then(function(response) {
          if (response.ok != 1) return res.status(500).send(new HTTPErrorResponse(error.message, 500));
          return res.status(200).send(new HTTPSuccessResponse("Friend request deleted", 200));
        });
    });
}

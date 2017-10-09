var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.findUserFriends = function(req, res) {
  User.findById(req.user.id).select('friends').populate('friends', (err, friends) => {
    if (err) res.send(500, err.message);
    res.status(200).jsonp(friends);
  });
};

exports.addFriend = function(req, res) {
  User.findById(req.user.id, (err, user) => {
    if (err) return res.send(500, err.message);
    if (req.user.id === req.body.user_id) {
      return res.status(400).send({
        error: "You can't add yourself as a friend"
      });
    }
    if (user.friends.indexOf(req.body.user_id) > -1) {
      return res.status(400).send({
        error: `You already have the user with the id '${req.body.user_id}' as a friend`
      });
    }
    user.friends.push(req.body.user_id);
    user.save(err => {
      if (err) return res.send(500, err.message);
      return res.status(200).jsonp(user);
    });
  });
};

exports.deleteFriend = function(req, res) {
  User.findById(req.user.id, (err, user) => {
    user.friends.pull({
      _id: req.body.user_id
    });
    user.save(error => {
      if (error) return res.send(500, error.message);
      return res.status(200).jsonp(user);
    });
  });
};

var mongoose = require('mongoose');
var User = mongoose.model('User');
var HTTPErrorResponse = require('./wrappers/http/HTTPErrorResponse');

//TODO this controller is used only for testing, it will be removed

exports.findAll = function(req, res) {
  User.find((err, users) => {
    return err ? res.status(500).send(new HTTPErrorResponse(err.message, 500)) : res.status(200).jsonp(users);
  }).populate("friends");
};

exports.findById = function(req, res) {
  User.findById(req.params.id, (err, user) => {
    if (!user) {
      return res.status(404).send(new HTTPErrorResponse(`There's no user with the id '${req.params.id}'`, 400));
    }
    return err ? res.status(500).send(new HTTPErrorResponse(err.message, 500)) : res.status(200).jsonp(user);
  });
};

exports.update = function(req, res) {
  User.findById(req.params.id, (err, user) => {
    user.name = req.body.name;
    user.email = req.body.email;
    user.genre = req.body.genre;
    user.save(error => {
      return error ? res.status(500).send(new HTTPErrorResponse(err.message, 500)) : res.status(200).jsonp(user);
    });
  });
};

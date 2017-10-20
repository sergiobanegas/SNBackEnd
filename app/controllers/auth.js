var mongoose = require('mongoose');
var User = mongoose.model('User');
var config = require("../../config");
var HTTPErrorResponse = require('./wrappers/http/HTTPErrorResponse');
var HTTP400ErrorResponse = require('./wrappers/http/HTTP400ErrorResponse');
var TokenResponse = require('./wrappers/auth/TokenResponse');
var authService = require('../services/auth');

exports.emailSignup = function(req, res) {
  if (!req.body.name || !req.body.email || !req.body.gender || !req.body.password || (req.body.gender != "male" && req.body.gender != "female")) {
    return res.status(400).send(new HTTP400ErrorResponse());
  }
  User.findOne({
    email: req.body.email
  }, (err, user) => {
    if (user) {
      return res.status(400).send(new HTTPErrorResponse("The email provided already exists", 400));
    }
    var user = new User({
      name: req.body.name,
      email: req.body.email,
      gender: req.body.gender,
      password: req.body.password,
      avatar: config.DEFAULT_AVATAR_IMAGE
    });
    user.save((err, user) => {
      return err ?
        res.send(500, err.message) :
        res.status(200).send(new TokenResponse(authService.createToken(user)));
    });
  });
};

exports.emailLogin = function(req, res) {
  User.findOne({
    email: req.body.email.toLowerCase()
  }, (err, user) => {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send(new HTTP400ErrorResponse());
    }
    if (!user) {
      return res.status(404).send(new HTTPErrorResponse("The user doesn't exist", 404));
    } else {
      user.comparePassword(req.body.password, (err, response) => {
        return err ?
          res.status(404).send(new HTTPErrorResponse(err.message, 404)) :
          res.status(200).send(new TokenResponse(authService.createToken(user)));
      });
    }
  });
};

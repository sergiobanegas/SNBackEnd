var mongoose = require('mongoose');
var User = mongoose.model('User');
var HTTPResponseError = require('./wrappers/errors/HTTPResponseError.js');

//TODO this controller is used only for testing, it will be removed

//GET - Return all registers
exports.findAll = function(req, res) {
  User.find((err, users) => {
    return err ? res.status(500).send(new HTTPResponseError(err.message, 500)) : res.status(200).jsonp(users);
  }).populate("friends");
};

//GET - Return a register with specified ID
exports.findById = function(req, res) {
  User.findById(req.params.id, (err, users) => {
    return err ? res.status(500).send(new HTTPResponseError(err.message, 500)) : res.status(200).jsonp(users);
  });
};

//PUT - Update a register already exists
exports.update = function(req, res) {
  User.findById(req.params.id, (err, user) => {
    user.name = req.body.name;
    user.email = req.body.email;
    user.genre = req.body.genre;
    user.save(error => {
      return error ? res.status(500).send(new HTTPResponseError(err.message, 500)) : res.status(200).jsonp(user);
    });
  });
};

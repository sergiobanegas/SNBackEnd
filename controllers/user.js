var mongoose = require('mongoose');
var User = mongoose.model('User');

//GET - Return all registers
exports.findAll = function(req, res) {
  User.find(function(err, users) {
    if (err) res.send(500, err.message);
    console.log('GET /users');
    res.status(200).jsonp(users);
  });
};

//GET - Return a register with specified ID
exports.findById = function(req, res) {
  User.findById(req.params.id, function(err, users) {
    if (err) return res.send(500, err.message);
    console.log('GET /users/' + req.params.id);
    res.status(200).jsonp(users);
  });
};

//PUT - Update a register already exists
exports.update = function(req, res) {
  User.findById(req.params.id, function(err, user) {
    user.name = req.body.name;
    user.email = req.body.email;
    user.genre = req.body.genre;
    user.save(function(err) {
      if (err) return res.send(500, err.message);
      res.status(200).jsonp(user);
    });
  });
};

//DELETE - Delete a register with specified ID
exports.delete = function(req, res) {
  User.findById(req.params.id, function(err, user) {
    user.remove(function(err) {
      if (err) return res.send(500, err.message);
      res.json({
        message: 'Successfully deleted'
      });
    });
  });
};

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var User = mongoose.model('User');
var authService = require('../services/auth');

exports.emailSignup = function(req, res) {
  bcrypt.hash(req.body.password, 5, (err, bcryptedPassword) => {
    var user = new User({
      name: req.body.name,
      email: req.body.email,
      genre: req.body.genre,
      password: bcryptedPassword,
    });
    user.save((err, user) => {
      return err ?
        res.send(500, err.message) :
        res.status(200).send({
          token: authService.createToken(user)
        });
    });
  });

};

exports.emailLogin = function(req, res) {
  User.findOne({
    email: req.body.email.toLowerCase()
  }, function(err, user) {
    if (!user) {
      return res.status(404).send({error: "Wrong credentials"});
    } else {
      bcrypt.compare(req.body.password, user.password, (err, response) => {
        console.log(err);
        return err ?
          res.status(404).send({error: "Wrong credentials"}) :
          res.status(200).send({
            token: authService.createToken(user)
          });
      });
    }
  });
};

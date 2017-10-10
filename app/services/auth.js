var jwt = require('jsonwebtoken');
var moment = require('moment');
var config = require('../../config');

exports.createToken = function(user) {
  var payload = {
    user: {
      id: user._id
    },
    iat: moment().unix(),
    exp: moment().add(14, "days").unix(),
  };
  return jwt.sign(payload, config.TOKEN_SECRET);
};

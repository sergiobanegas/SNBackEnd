var jwt = require('jsonwebtoken');
var moment = require('moment');
var config = require('./config');

exports.ensureAuthenticated = function(req, res, next) {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({
        message: "Unauthorized"
      });
  }

  var token = req.headers.authorization.split(" ")[1];
  var payload = jwt.verify(token, config.TOKEN_SECRET);

  if (payload.exp <= moment().unix()) {
    return res
      .status(401)
      .send({
        message: "Expired token"
      });
  }
  req.user = payload.user;
  next();
}

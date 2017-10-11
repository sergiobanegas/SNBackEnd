var jwt = require('jsonwebtoken');
var moment = require('moment');
var config = require('../config');
var HTTPErrorResponse = require('./controllers/wrappers/http/HTTPErrorResponse');

exports.ensureAuthenticated = function(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send(new HTTPErrorResponse("Unauthorized", 401));
  }

  var token = req.headers.authorization.split(" ")[1];
  var payload = jwt.verify(token, config.TOKEN_SECRET);

  if (payload.exp <= moment().unix()) {
    return res.status(401).send(new HTTPErrorResponse("Expired token", 401));
  }
  req.user = payload.user;
  next();
}

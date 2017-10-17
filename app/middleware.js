var jwt = require('jsonwebtoken');
var moment = require('moment');
var config = require('../config');
var HTTPErrorResponse = require('./controllers/wrappers/http/HTTPErrorResponse');

exports.ensureAuthenticated = function(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send(new HTTPErrorResponse("Unauthorized", 401));
  }
  let splitted = req.headers.authorization.split(" ");
  if (splitted.length != 2 || splitted[0] !== "JWT") {
    return res.status(400).send(new HTTPErrorResponse("Wrong authorization header", 400));
  }
  jwt.verify(splitted[1], config.TOKEN_SECRET, (error, payload) => {
    if (error) return res.status(400).send(new HTTPErrorResponse("Wrong token", 400));
    if (payload.exp <= moment().unix()) {
      return res.status(401).send(new HTTPErrorResponse("Expired token", 401));
    }
    req.user = payload.user;
    next();
  });
}

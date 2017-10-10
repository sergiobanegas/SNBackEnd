var HTTPResponseError = require("./HTTPResponseError.js");

class HTTP400ResponseError extends HTTPResponseError {
  constructor(message, code) {
    super("Bad request: invalid data", 400);
  }
}

module.exports = HTTP400ResponseError;

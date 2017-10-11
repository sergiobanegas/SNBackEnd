var HTTPResponse = require("./HTTPResponse");

class HTTP400ResponseError extends HTTPResponse {
  constructor() {
    super("Bad request: invalid data", 400, false);
  }
}

module.exports = HTTP400ResponseError;

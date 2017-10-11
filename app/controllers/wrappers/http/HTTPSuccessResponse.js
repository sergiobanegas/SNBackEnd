var HTTPResponse = require("./HTTPResponse");

class HTTPSuccessResponse extends HTTPResponse {
  constructor(message, code) {
    super(message, code, true)
  }
}

module.exports = HTTPSuccessResponse;

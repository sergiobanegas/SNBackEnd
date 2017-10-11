var HTTPResponse = require("./HTTPResponse");

class HTTPErrorResponse extends HTTPResponse {
  constructor(message, code) {
    super(message, code, false);
  }
}

module.exports = HTTPErrorResponse;

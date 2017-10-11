class HTTPResponse {
  constructor(message, code, success = true) {
    this.message = message;
    this.code = code;
    this.success = success;
  }
}

module.exports = HTTPResponse;

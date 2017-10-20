var config = require("../../config");
var supertest = require("supertest");
var should = require("should");

var server = supertest.agent(`http://localhost:${config.PORT}`);

describe("/auth", function() {

  it("should sign up correctly", function(done) {
    server
      .post("/auth/signup")
      .send({
        email: "auth-test@test.com",
        password: "1234",
        name: "Test",
        gender: "male"
      })
      .expect("Content-type", /json/)
      .expect(200)
      .end(function(err, res) {
        res.status.should.equal(200);
        should.exist(res.body.token);
        done();
      });
  });

  it("should login correctly", function(done) {
    server
      .post("/auth/login")
      .send({
        email: "auth-test@test.com",
        password: "1234"
      })
      .expect("Content-type", /json/)
      .expect(200)
      .end(function(err, res) {
        res.status.should.equal(200);
        should.exist(res.body.token);
        done();
      });
  });

});

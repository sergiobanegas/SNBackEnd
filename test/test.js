var config = require("../config");
var supertest = require("supertest");
var should = require("should");

var server = supertest.agent(`http://localhost:${config.PORT}`);

describe("/auth", function() {

  after(function(done) {
    db.connection.db.dropDatabase(function() {
      db.connection.close(function() {
        done();
      });
    });
  });

  it("should sign up correctly", function(done) {
    server
      .post("/auth/signup")
      .send({
        email: "testing@test.com",
        password: "1234",
        name: "Test",
        genre: "male"
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
        email: "testing@test.com",
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

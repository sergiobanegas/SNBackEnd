var config = require("../../config");
var supertest = require("supertest");
var should = require("should");
var jwt = require('jsonwebtoken');
var server = supertest.agent(`http://localhost:${config.PORT}`);

describe("/friends", function() {

  var token1;
  var token2;
  var userId1;
  var userId2;

  before(function(done) {
    server
      .post("/auth/signup")
      .send({
        email: "test@test.com",
        password: "1234",
        name: "Test1",
        genre: "male"
      })
      .end(function(err, res) {
        token1 = res.body.token;
        let payload = jwt.verify(token1, config.TOKEN_SECRET);
        userId1 = payload.user.id;
        server
          .post("/auth/signup")
          .send({
            email: "test2@test.com",
            password: "1234",
            name: "test2",
            genre: "female"
          })
          .end(function(err, res) {
            token2 = res.body.token;
            let payload = jwt.verify(token2, config.TOKEN_SECRET);
            userId2 = payload.user.id;
            done();
          });
      });
  });

  it("should add a friend request correctly", function(done) {
    server
      .post("/api/friends/requests")
      .set('Authorization', `JWT ${token1}`)
      .send({
        user_id: userId2
      })
      .expect(201)
      .end(function(err, res) {
        res.status.should.equal(201);
        done();
      });
  });

  it("should remove a friend request sent correctly", function(done) {
    server
      .delete("/api/friends/requests-sent")
      .set('Authorization', `JWT ${token1}`)
      .send({
        user_id: userId2
      })
      .expect(200)
      .end(function(err, res) {
        res.status.should.equal(200);
        done();
      });
  });

  it("should remove a friend request received correctly", function(done) {
    server
      .post("/api/friends/requests")
      .set('Authorization', `JWT ${token1}`)
      .send({
        user_id: userId2
      })
      .expect(201)
      .end(function(err, res) {
        server
          .delete("/api/friends/requests-received")
          .set('Authorization', `JWT ${token2}`)
          .send({
            user_id: userId1
          })
          .expect(200)
          .end(function(err, res) {
            res.status.should.equal(200);
            done();
          });
      });
  });

  it("should accept a friend request correctly", function(done) {
    server
      .post("/api/friends/requests")
      .set('Authorization', `JWT ${token1}`)
      .send({
        user_id: userId2
      })
      .expect(201)
      .end(function(err, res) {
        server
          .post("/api/friends")
          .set('Authorization', `JWT ${token2}`)
          .send({
            user_id: userId1
          })
          .expect(201)
          .end(function(err, res) {
            res.status.should.equal(201);
            done();
          });
      });
  });

  it("should delete a friend correctly", function(done) {
    server
      .post("/api/friends/requests")
      .set('Authorization', `JWT ${token1}`)
      .send({
        user_id: userId2
      })
      .expect(201)
      .end(function(err, res) {
        server
          .post("/api/friends")
          .set('Authorization', `JWT ${token2}`)
          .send({
            user_id: userId1
          })
          .expect(201)
          .end(function(err, res) {
            server
              .delete("/api/friends")
              .set('Authorization', `JWT ${token2}`)
              .send({
                user_id: userId1
              })
              .expect(200)
              .end(function(err, res) {
                res.status.should.equal(200);
                done();
              });
          });
      });
  });

});

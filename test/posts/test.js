var config = require("../../config");
var mongoose = require('mongoose');
var supertest = require("supertest");
var should = require("should");
var jwt = require('jsonwebtoken');
var server = supertest.agent(`http://localhost:${config.PORT}`);
var Post = require("../../app/models/post");

describe("/api/posts", function() {

  var token;
  var userId;

  before(function(done) {
    server
      .post("/auth/signup")
      .send({
        email: "test-posts@test.com",
        password: "1234",
        name: "TestPost",
        genre: "male"
      })
      .end(function(err, res) {
        token = res.body.token;
        let payload = jwt.verify(token, config.TOKEN_SECRET);
        userId = payload.user.id;
        done();
      });
  });

  it("should add a post correctly", function(done) {
    server
      .post("/api/posts")
      .set('Authorization', `JWT ${token}`)
      .send({
        title: "Test post",
        content: "Test post content",
        privacity: 2
      })
      .expect(201)
      .end(function(err, res) {
        res.status.should.equal(201);
        res.body.title.should.equal("Test post");
        should.exist(res.body._id);
        postId = res.body._id;
        done();
      });
  });

  it("should get one post correctly", function(done) {
    server
      .get(`/api/posts/${postId}`)
      .set('Authorization', `JWT ${token}`)
      .expect(200)
      .end(function(err, res) {
        res.status.should.equal(200);
        res.body._id.should.equal(postId);
        done();
      });
  });

  it("should like a post correctly", function(done) {
    server
      .post(`/api/posts/${postId}/like`)
      .set('Authorization', `JWT ${token}`)
      .expect(200)
      .end(function(err, res) {
        res.status.should.equal(200);
        server
          .get(`/api/posts/${postId}`)
          .set('Authorization', `JWT ${token}`)
          .expect(200)
          .end(function(err, res) {
            res.body.likes.should.have.lengthOf(1);
            var firstLike = res.body.likes[0];
            firstLike.should.equals(userId);
            done();
          });
      });
  });

});

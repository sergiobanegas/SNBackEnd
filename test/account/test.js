var config = require("../../config");
var supertest = require("supertest");
var should = require("should");
var jwt = require('jsonwebtoken');
var server = supertest.agent(`http://localhost:${config.PORT}`);

describe("/api/friends", function() {

  var token;
  var userId;
  var userId2;

  before(function(done) {
    server
      .post("/auth/signup")
      .send({
        email: "test5@test.com",
        password: "1234",
        name: "Test1",
        gender: "male"
      })
      .end(function(err, res) {
        token = res.body.token;
        let payload = jwt.verify(token, config.TOKEN_SECRET);
        userId = payload.user.id;
        server
          .post("/auth/signup")
          .send({
            email: "test6@test.com",
            password: "1234",
            name: "Test1",
            gender: "male"
          })
          .end(function(err, res) {
            let token2 = res.body.token;
            let payload2 = jwt.verify(token2, config.TOKEN_SECRET);
            userId2 = payload2.user.id;
            server
              .post("/api/posts")
              .set('Authorization', `JWT ${token}`)
              .send({
                title: "Title",
                content: "Content",
                privacity: 2
              })
              .end(function(err, res) {
                let post_id = res.body._id;
                server
                  .post("/comments")
                  .set('Authorization', `JWT ${token}`)
                  .send({
                    post_id: post_id,
                    content: "Comment content"
                  })
                  .end(function(err, res) {
                    server
                      .post("/conversation")
                      .set('Authorization', `JWT ${token}`)
                      .send({
                        content: "First message of the conversation",
                        members: [userId2]
                      })
                      .end(function(err, res) {
                        done();
                      });
                  });
              });
          });
      });
  });

  it("The user should be removed correctly", function(done) {
    server
      .delete("/api/account")
      .set('Authorization', `JWT ${token}`)
      .expect(200)
      .end(function(err, res) {
        res.status.should.equal(200);
        done();
      });
  });

});

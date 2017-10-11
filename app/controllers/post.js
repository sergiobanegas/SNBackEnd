var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

var HTTPErrorResponse = require('./wrappers/http/HTTPErrorResponse');
var HTTP400ResponseError = require('./wrappers/http/HTTP400ErrorResponse');
var HTTPSuccessResponse = require('./wrappers/http/HTTPSuccessResponse');

exports.findAll = function(req, res) {
  Post.find((err, posts) => {
    return err ? res.send(new HTTPErrorResponse(err.message, 500)) : res.status(200).jsonp(posts);
  }).select("-__v").populate("author", "-password -__v");
};

exports.findById = function(req, res) {
  Post.findById(req.params.id, (err, post) => {
    if (!post) {
      return res.status(404).send(new HTTPErrorResponse(`The post with the id '${req.params.id}' doesn't exists`, 404));
    }
    return err ? res.send(new HTTPErrorResponse(err.message, 500)) : res.status(200).jsonp(post);
  }).populate("author", "-password -__v").populate("likes").populate("comments");
};

exports.add = function(req, res) {
  if (!req.body.title || !req.body.content || !req.body.privacity) {
    return res.status(400).send(new HTTP400ErrorResponse());
  }
  var post = new Post({
    title: req.body.title,
    content: req.body.content,
    author: req.user.id,
    privacity: req.body.privacity,
    image: req.body.image
  });
  post.save((err, response) => {
    return err ? res.send(new HTTPErrorResponse(err.message, 500)) : res.status(200).jsonp(response);
  });
};

exports.update = function(req, res) {
  if (!req.body.title || !req.body.content || !req.body.privacity) {
    return res.status(400).send(new HTTP400ErrorResponse());
  }
  Post.findById(req.params.id, (err, post) => {
    if (err) return res.send(new HTTPErrorResponse(err.message, 500));
    if (!post) {
      return res.status(404).send(new HTTPErrorResponse("The post doesn't exists", 404));
    }
    post.title = req.body.title;
    post.content = req.body.content;
    post.privacity = req.body.privacity;
    post.save(error => {
      return error ? res.status(500).send(new HTTPErrorResponse(error.message, 500)) : res.status(200).jsonp(post);
    });
  });
};

exports.delete = function(req, res) {
  Post.findById(req.params.id, (err, post) => {
    if (err) return res.status(500).send(new HTTPErrorResponse(err.message, 500));
    if (req.user.isAdmin || req.user.id != post.author) {
      return res.status(401).send(new HTTPErrorResponse("You don't have authorization to remove the post", 401));
    }
    if (!post) {
      return res.status(404).send(new HTTPErrorResponse("The post doesn't exists", 404));
    }
    post.remove(error => {
      return error ? res.send(new HTTPErrorResponse(error.message, 500)) : res.status(204).send(new HTTPSuccessResponse("Post deleted", 201 ));
    });
  });
};

exports.like = function(req, res) {
  Post.findById(req.params.id, (err, post) => {
    if (err) return res.send(new HTTPErrorResponse(err.message, 500));
    if (!post) {
      return res.status(404).send(new HTTPErrorResponse("The post doesn't exists", 404));
    }
    post.likes.indexOf(req.user.id) === -1 ? post.likes.push(req.user.id) : post.likes.pull(req.user.id);
    post.save(error => {
      return error ? res.status(500).send(new HTTPErrorResponse(error.message, 500)) : res.status(200).send(new HTTPSuccessResponse("Post liked", 201 ));
    });
  });
};

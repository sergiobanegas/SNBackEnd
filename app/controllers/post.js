var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var PostComment = mongoose.model('PostComment');

var HTTPResponseError = require('./wrappers/errors/HTTPResponseError.js');
var HTTP400ResponseError = require('./wrappers/errors/HTTP400ResponseError.js');

exports.findAll = function(req, res) {
  Post.find((err, posts) => {
    return err ? res.send(new HTTPResponseError(err.message, 500)) : res.status(200).jsonp(posts);
  }).select("-__v").populate("author", "-password -__v");
};

exports.findById = function(req, res) {
  Post.findById(req.params.id, (err, post) => {
    if (!post) {
      return res.status(404).send(new HTTPResponseError(`The post with the id ${req.params.id} doesn't exists`, 400));
    }
    return err ? res.send(new HTTPResponseError(err.message, 500)) : res.status(200).jsonp(post);
  }).populate("author", "-password -__v").populate("likes").populate("comments");
};

exports.add = function(req, res) {
  if (!req.body.title || !req.body.content || !req.body.privacity) {
    return res.status(400).send(new HTTP400ResponseError());
  }
  var post = new Post({
    title: req.body.title,
    content: req.body.content,
    author: req.user.id,
    privacity: req.body.privacity,
    image: req.body.image
  });
  post.save((err, response) => {
    return err ? res.send(new HTTPResponseError(err.message, 500)) : res.status(200).jsonp(response);
  });
};

exports.update = function(req, res) {
  if (!req.body.title || !req.body.content || !req.body.privacity) {
    return res.status(400).send(new HTTP400ResponseError());
  }
  Post.findById(req.params.id, (err, post) => {
    if (err) return res.send(new HTTPResponseError(err.message, 500));
    if (!post) {
      return res.status(404).send(new HTTPResponseError("The post doesn't exists", 404));
    }
    post.title = req.body.title;
    post.content = req.body.content;
    post.privacity = req.body.privacity;
    post.save(error => {
      return error ? res.status(500).send(new HTTPResponseError(error.message, 500)) : res.status(200).jsonp(post);
    });
  });
};

exports.delete = function(req, res) {
  Post.findById(req.params.id, (err, post) => {
    if (err) return res.status(500).send(new HTTPResponseError(err.message, 500));
    if (req.user.isAdmin || req.user.id !== post.author) {
      return res.status(401).send(new HTTPResponseError("You don't have authorization to remove the post", 401));
    }
    if (!post) {
      return res.status(404).send(new HTTPResponseError("The post doesn't exists", 404));
    }
    post.remove(error => {
      return error ? res.send(new HTTPResponseError(error.message, 500)) : res.status(204);
    });
  });
};

exports.like = function(req, res) {
  Post.findById(req.params.id, (err, post) => {
    if (err) return res.send(new HTTPResponseError(err.message, 500));
    if (!post) {
      return res.status(404).send(new HTTPResponseError("The post doesn't exists", 404));
    }
    post.likes.indexOf(req.user.id) === -1 ? post.likes.push(req.user.id) : post.likes.pull(req.user.id);
    post.save(error => {
      return error ? res.status(500).send(new HTTPResponseError(error.message, 500)) : res.status(200);
    });
  });
};

exports.addComment = function(req, res) {
  Post.findById(req.params.id, (err, post) => {
    if (err) return res.send(new HTTPResponseError(err.message, 500));
    if (!post) {
      return res.status(404).send(new HTTPResponseError("The post doesn't exists", 404));
    }
    if (!req.body.content) {
      return res.status(400).send(new HTTP400ResponseError());
    }
    var comment = new PostComment({
      author: req.user.id,
      content: req.body.content,
      post: req.params.id
    });
    comment.save(error => {
      if (error) {
        return res.status(500).send(new HTTPResponseError(err.message, 500));
      }
      console.log(comment);
      post.comments.push(comment);
      post.save(error => {
        return error ? res.status(500).send(new HTTPResponseError(error.message, 500)) : res.status(200);
      });
    });
  });
};

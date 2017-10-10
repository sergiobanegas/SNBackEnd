var mongoose = require('mongoose');
var PostComment = mongoose.model('PostComment');
var PostCommentReply = mongoose.model('PostCommentReply');
var Post = mongoose.model('Post');
var HTTPResponseError = require('./wrappers/errors/HTTPResponseError.js');

exports.findById = function(req, res) {
  PostComment.findById(req.params.id, (err, comment) => {
    if (!comment) {
      return res.status(404).send(new HTTPResponseError(`The comment with the id ${req.params.id} doesn't exists`, 400));
    }
    return err ? res.send(new HTTPResponseError(err.message, 500)) : res.status(200).jsonp(comment);
  }).populate("author", "-password -__v").populate("likes").populate("replies");
};

exports.delete = function(req, res) {
  PostComment.findById(req.params.id, (err, comment) => {
    if (err) return res.status(500).send(new HTTPResponseError(err.message, 500));
    if (!req.user.isAdmin && req.user.id != comment.author) {
      return res.status(401).send(new HTTPResponseError("You don't have authorization to remove the comment", 401));
    }
    if (!comment) {
      return res.status(404).send(new HTTPResponseError("The comment doesn't exists", 404));
    }
    //TODO borrar los sub-posts
    Post.findById(comment.post, (err, post) => {
      if (err) return res.status(500).send(new HTTPResponseError(err.message, 500));
      if (!post) {
        return res.status(404).send(new HTTPResponseError("The post doesn't exists", 404));
      }
      post.comments.pull(comment._id);
      post.save(error => {
        if (error) return res.status(500).send(new HTTPResponseError(err.message, 500));
        comment.remove(error => {
          return error ? res.send(new HTTPResponseError(error.message, 500)) : res.status(204);
        });
      });
    });
  });
};

exports.like = function(req, res) {
  PostComment.findById(req.params.id, (err, comment) => {
    if (err) return res.send(new HTTPResponseError(err.message, 500));
    if (!comment) {
      return res.status(404).send(new HTTPResponseError("The comment doesn't exists", 404));
    }
    comment.likes.indexOf(req.user.id) === -1 ? comment.likes.push(req.user.id) : comment.likes.pull(req.user.id);
    comment.save(error => {
      return error ? res.status(500).send(new HTTPResponseError(error.message, 500)) : res.status(200);
    });
  });
};

exports.addReply = function(req, res) {
  PostComment.findById(req.params.id, (err, postComment) => {
    if (err) return res.send(new HTTPResponseError(err.message, 500));
    if (!postComment) {
      return res.status(404).send(new HTTPResponseError("The post comment doesn't exists", 404));
    }
    if (!req.body.content) {
      return res.status(400).send(new HTTP400ResponseError());
    }
    var comment = new PostCommentReply({
      author: req.user.id,
      content: req.body.content,
      comment: req.params.id
    });
    comment.save(error => {
      if (error) {
        return res.status(500).send(new HTTPResponseError(err.message, 500));
      }
      postComment.replies.push(comment);
      postComment.save(error => {
        return error ? res.status(500).send(new HTTPResponseError(error.message, 500)) : res.status(200);
      });
    });
  });
};

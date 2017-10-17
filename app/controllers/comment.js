var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var HTTPErrorResponse = require('./wrappers/http/HTTPErrorResponse');
var HTTPSuccessResponse = require('./wrappers/http/HTTPSuccessResponse');
var HTTP400ErrorResponse = require('./wrappers/http/HTTP400ErrorResponse');

exports.findById = function(req, res) {
  Comment.findById(req.params.id, (err, comment) => {
    if (!comment) {
      return res.status(404).send(new HTTPErrorResponse(`The comment with the id ${req.params.id} doesn't exists`, 400));
    }
    return err ? res.send(new HTTPErrorResponse(err.message, 500)) : res.status(200).jsonp(comment);
  }).select("-__v").populate("author", "_id name avatar").populate("likes").populate({
    path: 'replies',
    model: 'Comment',
    select: "-__v",
    populate: {
      path: 'author',
      model: 'User',
      select: "name avatar _id"
    }
  });
};

exports.add = function(req, res) {
  if (!req.body.content) {
    return res.status(400).send(new HTTP400ErrorResponse());
  }
  return req.body.parent ? addCommentToComment(req, res) : addCommentToPost(req, res);
};

exports.delete = function(req, res) {
  Comment.findById(req.params.id, (err, comment) => {
    if (err) return res.status(500).send(new HTTPErrorResponse(err.message, 500));
    if (!req.user.isAdmin && req.user.id != comment.author) {
      return res.status(401).send(new HTTPErrorResponse("You don't have authorization to remove the comment", 401));
    }
    if (!comment) {
      return res.status(404).send(new HTTPErrorResponse("The comment doesn't exists", 404));
    }
    comment.remove(error => {
      return error ? res.send(new HTTPErrorResponse(error.message, 500)) : res.status(200).send(new HTTPSuccessResponse("Comment removed", 200));
    });
  });
};

exports.like = function(req, res) {
  Comment.findById(req.params.id, (err, comment) => {
    if (err) return res.send(new HTTPErrorResponse(err.message, 500));
    if (!comment) {
      return res.status(404).send(new HTTPErrorResponse("The comment doesn't exists", 404));
    }
    comment.likes.indexOf(req.user.id) === -1 ? comment.likes.push(req.user.id) : comment.likes.pull(req.user.id);
    comment.save(error => {
      return error ? res.status(500).send(new HTTPErrorResponse(error.message, 500)) : res.status(200).send(comment.likes);
    });
  });
};

addCommentToPost = function(req, res) {
  if (!req.body.post_id) {
    return res.status(400).send(new HTTP400ErrorResponse());
  }
  Post.findById(req.body.post_id, (err, post) => {
    if (err) return res.send(new HTTPErrorResponse(err.message, 500));
    if (!post) {
      return res.status(404).send(new HTTPErrorResponse("The post doesn't exists", 404));
    }
    var comment = new Comment({
      author: req.user.id,
      content: req.body.content,
      post: req.body.post_id
    });
    comment.save(error => {
      if (error) {
        return res.status(500).send(new HTTPErrorResponse(err.message, 500));
      }
      post.comments.push(comment);
      post.save(error => {
        return error ? res.status(500).send(new HTTPErrorResponse(error.message, 500)) : res.status(200).jsonp({
          updatedAt: comment.updatedAt,
          createdAt: comment.createdAt,
          author: comment.author,
          content: comment.content,
          post: comment.post,
          _id: comment._id,
          likes: comment.likes,
          replies: comment.replies
        });
      });
    });
  });
}

addCommentToComment = function(req, res) {
  Comment.findById(req.body.parent, (err, postComment) => {
    if (err) return res.send(new HTTPErrorResponse(err.message, 500));
    if (!postComment) {
      return res.status(404).send(new HTTPErrorResponse("The post comment doesn't exists", 404));
    }
    var newComment = new Comment({
      author: req.user.id,
      content: req.body.content,
      post: postComment.post,
      parent: req.body.parent
    });
    newComment.save(error => {
      if (error) {
        return res.status(500).send(new HTTPErrorResponse(err.message, 500));
      }
      postComment.replies.push(newComment);
      postComment.save(error => {
        return error ? res.status(500).send(new HTTPErrorResponse(error.message, 500)) : res.status(200).jsonp({
          updatedAt: newComment.updatedAt,
          createdAt: newComment.createdAt,
          author: newComment.author,
          content: newComment.content,
          post: newComment.post,
          _id: newComment._id,
          likes: newComment.likes,
          replies: newComment.replies
        });
      });
    });
  });
}

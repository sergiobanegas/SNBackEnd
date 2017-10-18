var mongoose = require('mongoose');
var User = mongoose.model('User');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

var HTTPErrorResponse = require('./wrappers/http/HTTPErrorResponse');
var HTTP400ErrorResponse = require('./wrappers/http/HTTP400ErrorResponse');
var HTTPSuccessResponse = require('./wrappers/http/HTTPSuccessResponse');

exports.findAll = function(req, res) {
  User.findById(req.user.id, (error, user) => {
    let filtered_authors = user.friends.concat(req.user.id);
    Post.find({
      author: {
        $in: filtered_authors
      }
    }, (err, posts) => {
      return err ? res.send(new HTTPErrorResponse(err.message, 500)) : res.status(200).jsonp(posts);
    }).select("-__v").populate("author", "_id name avatar");
  });
};

exports.findUserPosts = function(req, res) {
  Post.find({
    author: req.user.id
  }, (err, posts) => {
    return err ? res.send(new HTTPErrorResponse(err.message, 500)) : res.status(200).jsonp(posts);
  }).select("-__v").populate("author", "_id name avatar");
};

exports.findById = function(req, res) {
  Post.findById(req.params.id, (err, post) => {
    if (!post) {
      return res.status(404).send(new HTTPErrorResponse(`The post with the id '${req.params.id}' doesn't exists`, 404));
    }
    return err ? res.send(new HTTPErrorResponse(err.message, 500)) : res.status(200).jsonp(post);
  }).select("-__v").populate("author", "_id name avatar").populate({
    path: "comments",
    model: "Comment",
    select: "_id updatedAt createdAt content author likes replies",
    populate: {
      path: "author",
      model: "User",
      select: "_id name avatar"
    }
  });
};

exports.add = function(req, res) {
  if (!req.body.title || !req.body.content || !req.body.privacity || req.body.privacity < 0 || req.body.privacity > 2) {
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
    return err ? res.send(new HTTPErrorResponse(err.message, 500)) : res.status(201).jsonp({
      updatedAt: response.updatedAt,
      createdAt: response.createdAt,
      title: response.title,
      content: response.content,
      author: response.author,
      privacity: response.privacity,
      _id: response._id,
      likes: [],
      comments: []
    });
  });
};

exports.update = function(req, res) {
  Post.findById(req.params.id, (err, post) => {
    if (err) return res.send(new HTTPErrorResponse(err.message, 500));
    if (!post) {
      return res.status(404).send(new HTTPErrorResponse("The post doesn't exists", 404));
    }
    if (req.body.title) {
      post.title = req.body.title;
    }
    if (req.body.content) {
      post.content = req.body.content;
    }
    if (req.body.privacity) {
      post.privacity = req.body.privacity;
    }
    post.save(error => {
      return error ? res.status(500).send(new HTTPErrorResponse(error.message, 500)) : res.status(200).jsonp(post);
    });
  }).select("-__v");
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
      return error ? res.send(new HTTPErrorResponse(error.message, 500)) : res.status(200).send(new HTTPSuccessResponse("Post deleted", 200));
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
      return error ? res.status(500).send(new HTTPErrorResponse(error.message, 500)) : res.status(200).jsonp(post.likes);
    })
  });
};

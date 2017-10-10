var mongoose = require('mongoose');
var PostCommentReplyReply = mongoose.model('PostCommentReplyReply');
var HTTPResponseError = require('./wrappers/errors/HTTPResponseError.js');

exports.findById = function(req, res) {
  PostCommentReplyReply.findById(req.params.id, (err, comment) => {
    if (!comment) {
      return res.status(404).send(new HTTPResponseError(`The reply with the id ${req.params.id} doesn't exists`, 400));
    }
    return err ? res.send(new HTTPResponseError(err.message, 500)) : res.status(200).jsonp(comment);
  }).populate("author", "-password -__v").populate("likes").populate("comments");
};

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postCommentReplySchema = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  post_comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PostCommentReply'
  },
  content: {
    type: String
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PostCommentReply'
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('PostCommentReply', postCommentReplySchema);

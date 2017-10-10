var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var replySchema = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  post_comment_reply: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PostComment'
  },
  content: {
    type: String
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PostComment'
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('PostCommentReplyReply', replySchema);

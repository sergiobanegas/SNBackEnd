var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postCommentSchema = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
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

module.exports = mongoose.model('PostComment', postCommentSchema);

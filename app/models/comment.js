var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  content: {
    type: String
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

commentSchema.pre('remove', function(next) {
  if (this.parent) {
    this.model('Comment').remove({
      replies: {
        "$nin": [this._id]
      }
    }, next);
  } else {
    this.model('Post').remove({
      comments: {
        "$nin": [this._id]
      }
    }, next);
  }
});

module.exports = mongoose.model('Comment', commentSchema);

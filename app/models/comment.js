var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  content: {
    type: String,
    required: true
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
    this.model("Post").update({
      _id: this.post._id
    }, {
      $pull: {
        comments: this._id
      }
    }, next);
  } else {
    this.model("Comment").update({
      _id: this.post._id
    }, {
      $pull: {
        replies: this._id
      }
    }, next);
  }
});

module.exports = mongoose.model('Comment', commentSchema);

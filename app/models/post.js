var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  privacity: {
    type: Number,
    enum: [0, 1, 2],
    required: true
  },
  image: {
    type: String
  },
  comments: [{
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

postSchema.pre('remove', function(next) {
  this.model('Comment').remove({
    post: this._id
  }, next);
});

module.exports = mongoose.model('Post', postSchema);

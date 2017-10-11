var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
  title: {
    type: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  content: {
    type: String
  },
  privacity: {
    type: Number,
    enum: [0, 1, 2]
  },
  image: {
    type: String
  },
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
  likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema);

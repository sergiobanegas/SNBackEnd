var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var publicationSchema = new Schema({
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
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Publication', publicationSchema);

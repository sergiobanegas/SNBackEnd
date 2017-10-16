var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var conversationSchema = new Schema({
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }]
}, {
  timestamps: true
});

conversationSchema.pre('remove', function(next) {
  for (let message of this.messages)
    this.model("Message").remove({
      _id: message
    }, next);
});

module.exports = mongoose.model('Conversation', conversationSchema);

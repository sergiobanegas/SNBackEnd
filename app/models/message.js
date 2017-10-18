var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  }
}, {
  timestamps: true
});

messageSchema.pre('remove', function(next) {
  console.log(":D");
  this.model("Conversation").update({
    _id: this.conversation._id
  }, {
    $pull: {
      messages: this._id
    }
  }, next);
});

module.exports = mongoose.model('Message', messageSchema);

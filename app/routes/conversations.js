var express = require('express');
var router = express.Router();
var ConversationCtrl = require('../controllers/conversation');

router.route('/')
  .post(ConversationCtrl.add);

router.route('/:id')
  .get(ConversationCtrl.findById)
  .delete(ConversationCtrl.delete);

router.route('/:id/messages')
  .post(ConversationCtrl.addMessage);

router.route('/:id/members')
  .post(ConversationCtrl.addMember);

router.route('/:id/messages/:messageId')
  .put(ConversationCtrl.updateMessage)
  .delete(ConversationCtrl.deleteMessage);

module.exports = router;

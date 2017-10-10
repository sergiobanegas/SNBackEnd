var express = require('express');
var router = express.Router();
var PostCommentReplyReplyCtrl = require('../controllers/post_comment_reply_reply');

router.route('/:id')
  .get(PostCommentReplyReplyCtrl.findById);

module.exports = router;

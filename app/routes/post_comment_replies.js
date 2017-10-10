var express = require('express');
var router = express.Router();
var PostCommentReplyCtrl = require('../controllers/post_comment_reply');

router.route('/:id')
  .get(PostCommentReplyCtrl.findById)
  .delete(PostCommentReplyCtrl.delete);

router.route('/:id/replies')
  .post(PostCommentReplyCtrl.addReply);

module.exports = router;

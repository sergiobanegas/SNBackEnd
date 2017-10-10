var express = require('express');
var router = express.Router();
var PostCommentCtrl = require('../controllers/post_comment');

router.route('/:id')
  .get(PostCommentCtrl.findById)
  .delete(PostCommentCtrl.delete);


router.route('/:id/replies')
  .post(PostCommentCtrl.addReply);

module.exports = router;

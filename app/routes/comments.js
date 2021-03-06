var express = require('express');
var router = express.Router();
var CommentCtrl = require('../controllers/comment');

router.route('/')
  .post(CommentCtrl.add)

router.route('/:id')
  .get(CommentCtrl.findById)
  .delete(CommentCtrl.delete);

router.route('/:id/like')
  .post(CommentCtrl.like);

module.exports = router;

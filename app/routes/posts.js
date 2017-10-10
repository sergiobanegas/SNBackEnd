var express = require('express');
var router = express.Router();
var PostCtrl = require('../controllers/post');

router.route('/')
  .get(PostCtrl.findAll)
  .post(PostCtrl.add);

router.route('/:id')
  .get(PostCtrl.findById)
  .put(PostCtrl.update)
  .delete(PostCtrl.delete);

router.route('/:id/like')
  .post(PostCtrl.like);

router.route('/:id/comments')
  .post(PostCtrl.addComment);

module.exports = router;

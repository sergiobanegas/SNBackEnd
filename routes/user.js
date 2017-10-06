var express = require('express');
var router = express.Router();
var UserCtrl = require('../controllers/users');

router.route('/')
  .get(UserCtrl.findAll);

router.route('/:id')
  .get(UserCtrl.findById)
  .put(UserCtrl.update)
  .delete(UserCtrl.delete);

module.exports = router;
